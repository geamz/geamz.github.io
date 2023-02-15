<ul>
{% for x in site.nyakula %}
    {% assign y = x.url | split: "/" | size %}
    {% if x.url contains "_" %}
        <li>
            <a href="{{x.url}}">{{x.title}}</a>
        </li>
    {% endif %}
{% endfor %}
</ul>

