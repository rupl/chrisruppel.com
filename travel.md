---
title: Travel
---

I went places.

{% for trip in site.trips reversed %}
  <h2><a href="{{ trip.url }}">{{ trip.title }}</a></h2>
{% endfor %}
