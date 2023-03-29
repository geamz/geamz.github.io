import Control.Monad
import Data.Maybe
import Data.Either
import System.Random hiding (next)

--音素:子音　硬口蓋化とかは非対応

data Bui = Ryoushin | Ha | Shinshi | Haguki | KoubuHaguki | HagukiKoukougai | Koukougai | Nankougai | Seimon  deriving (Show, Eq)
data Shu = Bi | Haretsu | Hajiki | Masatsu | Sekkin | Sokumen | Sokumensekkin deriving (Show, Eq)

data Con = Con String Bui Shu Bool  deriving (Show, Eq)

--音素:母音

data Tate = Sema | Chuo | Hiro  deriving (Show, Eq)
data Yoko = Mae | Naka | Ato  deriving (Show, Eq)

data Vowel = Vowel String Tate Yoko | Shuon Con  deriving (Show, Eq) 

-- 音素型クラス
-- Show のインスタンスでもいいけど、なんかデバッグしにくそうなので

class Phoneme a where
    ch :: a -> String

instance Phoneme Con where
    ch (Con str _ _ _) = str

instance Phoneme Vowel where
    ch (Vowel str _ _) = str
    ch (Shuon con    ) = (ch con) ++ "'"


--拍(符号用)

data Haku' = C' | CV' | V' | Q' | JV' | O' deriving (Show, Eq)

--拍(出力用)

data Haku = CV (Maybe Con) (Maybe Vowel) | Q Con | JV Vowel | O deriving (Show, Eq)  --Oで文おｋかも

--つくる
_c c = CV (Just c) Nothing
_v   = CV Nothing . Just
_cv  = ( . Just ) . CV . Just

--みる
igil :: Haku -> Maybe String
igil (CV mc mv) = (ch <$> mc) <> (ch <$> mv)
igil (Q  c    ) = pure $ ch c
igil (JV    v ) = pure $ ch v
igil  O         = pure ""


-- さて

-- 乱択君(Walker's alias)

rantaku :: ((Double, [(Double, Int, Int)]), [b]) -> IO b
rantaku ((av, omojbox), elj) = do
    et <- randomRIO (0, length omojbox - 1) :: IO Int
    qa <- randomRIO (0, av) :: IO Double

    return $ rantaku' qa elj $ omojbox !! et
        where
            rantaku' r elj ( threshold, bottom, top )
                | r < threshold = elj !! bottom
                | otherwise     = elj !! top

ranavo :: Eq b => [b] -> ((Double, [(Double, Int, Int)]), [b]) -> IO b
ranavo as bo = do
    x <- rantaku bo
    if x `elem` as then
        ranavo as bo
    else
        return x


box :: [Double] -> [b] -> ((Double, [(Double, Int, Int)]), [b])
box a b = box' $ unzip $ zip a b 
    where
        box' :: (Fractional a, Real a) => ([a], [b]) -> ((a, [(a, Int, Int)]), [b])
        box' (omoj, elj) = let av = (realToFrac $ sum omoj) / fromIntegral (length omoj)
                    in (box'' av ( wfyne av ( zip [0..] omoj ) , [] ), elj)

        box'' :: (Ord a, Num a) => a -> (([(b, a)], [(b, a)]), [(a, b, b)]) -> (a, [(a, b, b)])
        box'' av ( ([], fnj), tbt) = (av, tbt ++ map ( \(fni, fn) -> ( fn, fni, fni ) ) fnj)
        box'' av ( (wj, [] ), tbt) = (av, tbt ++ map ( \(wi , w ) -> ( av, wi , wi  ) ) wj )
        box'' av iroiro            = box'' av $ next av iroiro

        next av ( ((wi,w):wj, (fni,fn):fnj), tbt )
            | w - (av-fn) > av = (( (wi, w - (av-fn)):wj ,                   fnj), (fn, fni, wi):tbt)
            | otherwise        = ((                   wj , (wi, w - (av-fn)):fnj), (fn, fni, wi):tbt)

        wfyne av omoj = partitionEithers $ map ( test ((<=av) . snd) ) omoj
            where
                test :: (a -> Bool) -> a -> Either a a
                test f a
                    | f a       = Right a
                    | otherwise = Left a

-- 作るよ


-- なぜかなかった
iterateM :: (Monad m) => Int -> (a -> m a) -> a -> m [a]
iterateM cnt f a
    | cnt <= 0  = pure []
    | otherwise = ((a:) <$>) . iterateM (cnt - 1) f =<< f a


haku    = box [0.03, 0.21, 0.51, 0.24, 0.005, 0.005] [1..]

cv_c    = box (repeat 1.0) [
    Con "m" Ryoushin Bi True,
    Con "n" Haguki Bi True,
    Con "p" Ryoushin Haretsu False,
    Con "b" Ryoushin Haretsu True,
    Con "t" Haguki Haretsu False,
    Con "d" Haguki Haretsu True,
    Con "k" Nankougai Haretsu False,
    Con "q" Nankougai Haretsu True,
    Con "r" Haguki Hajiki True,
    Con "f" Shinshi Masatsu False,
    Con "v" Shinshi Masatsu True,
    Con "s" Haguki Masatsu False,
    Con "z" Haguki Masatsu True,
    Con "c" KoubuHaguki Masatsu False,
    Con "g" KoubuHaguki Masatsu True,
    Con "j" HagukiKoukougai Masatsu True,
    Con "x" Nankougai Masatsu False,
    Con "h" Seimon Masatsu False,
    Con "y" Koukougai Sekkin True,
    Con "w" Nankougai Sekkin True,
    Con "l" Haguki Sokumensekkin True
    ]

cv_v    = box (repeat 1.0) [
    Vowel "a" Hiro Mae,
    Vowel "i" Sema Mae,
    Vowel "u" Sema Ato,
    Vowel "e" Chuo Mae,
    Vowel "o" Chuo Ato
    ]

cv_sh = box (repeat 1.0) [
    Shuon (Con "m" Ryoushin Bi True),
    Shuon (Con "n" Haguki Bi True)
    ]


o_ojv   = box [0.15, 0.50, 0.35] [C', CV', V']
o_cq    = box [0.15, 0.50] [C', CV']
o_vcv   = box [0.15, 0.50, 0.35, 0.20, 0.10] [C', CV', V', JV', Q']
o_vcvm  = box [0.15, 0.50, 0.35, 0.05] [C', CV', V', Q']

ptyol :: IO [Haku]
ptyol = do
            haku_n  <- rantaku haku
            iterateM (haku_n+1) (liftM2 (>>=) nextHaku' nextHaku) O
            where
                -- 次の拍の種類を決める
                nextHaku' :: Haku -> IO Haku'
                nextHaku'  O                      = rantaku o_ojv
                nextHaku' (JV _)                  = rantaku o_ojv
                nextHaku' (Q _)                   = rantaku o_cq
                nextHaku' (CV _  Nothing)         = rantaku o_cq
                nextHaku' (CV _ (Just (Shuon _))) = rantaku o_vcvm
                nextHaku' (CV _ (Just _))         = rantaku o_vcv

                -- 次の拍を作る
                nextHaku :: Haku -> Haku' -> IO Haku
                nextHaku (JV           v      ) V'  = _v    <$>                     ranavo [v] cv_v
                nextHaku (CV (Just c)  Nothing) C'  = _c    <$> ranavo [c] cv_c
                nextHaku (CV (Just c)  Nothing) CV' = _cv   <$> ranavo [c] cv_c <*> rantaku cv_v
                nextHaku (CV  _       (Just v)) V'  = _v    <$>                     ranavo [v] cv_v
                nextHaku (CV  _       (Just v)) JV' = return (JV v)
                nextHaku (Q   c               ) CV' = _cv c <$>                     rantaku cv_v
                nextHaku  O                     CV' = do
                    r <- randomRIO (0.0,1.0) :: IO Double
                    _cv <$> rantaku cv_c <*> rantaku (if r < 0.02 then cv_sh else cv_v)
                nextHaku  O                     V'  = do
                    r <- randomRIO (0.0,1.0) :: IO Double
                    _v  <$>                  rantaku (if r < 0.06 then cv_sh else cv_v)
                nextHaku  _ C' = _c  <$> rantaku cv_c
                nextHaku  _ CV'= _cv <$> rantaku cv_c <*> rantaku cv_v
                nextHaku  _ V' = _v  <$>                  rantaku cv_v
                nextHaku  _ Q' = Q   <$> rantaku cv_c


main :: IO ()
main = concat . map (fromJust.igil) <$> ptyol >>= putStrLn

nhol :: Int -> IO ()
nhol n = replicateM_ n main