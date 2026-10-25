# -*- coding: utf-8 -*-
"""Validate rendered search pages. Run against `npm run start`, not a live deployment."""
import json
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import urlopen
from urllib.error import HTTPError
from xml.etree import ElementTree

base = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3093'
origin = 'https://www.koofy.co.kr'
data = json.loads((Path(__file__).resolve().parents[1] / 'lib/discovery/content.json').read_text())

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.links=[]; self.meta=[]; self.json=[]; self.text=[]; self.h1=0; self.article_lang=None; self.script=None
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if tag=='link': self.links.append(attrs)
        if tag=='meta': self.meta.append(attrs)
        if tag=='h1': self.h1+=1
        if tag=='article': self.article_lang=attrs.get('lang')
        if tag=='script': self.script=attrs.get('type','script')
    def handle_endtag(self,tag):
        if tag=='script': self.script=None
    def handle_data(self, text):
        if self.script=='application/ld+json': self.json.append(json.loads(text))
        elif self.script is None: self.text.append(text)

def get(path):
    with urlopen(base+path) as response:
        assert response.status==200, path
        assert 'noindex' not in response.headers.get('X-Robots-Tag',''), path
        return response.read().decode('utf-8')

paths=[]
for language, pages in data.items():
    for topic, (title, summary, sections, steps) in pages.items():
        path='/'+language+('/'+topic if topic else '')
        parser=Page(); parser.feed(get(path)); paths.append(path)
        assert parser.h1==1 and parser.article_lang==language, path
        text=''.join(parser.text)
        assert title in text and summary in text, path
        for heading, body in sections: assert heading in text and body in text, path
        for step in steps: assert step in text, path
        assert [v['href'] for v in parser.links if v.get('rel')=='canonical']==[origin+path], path
        alternate={v['hreflang']:v['href'] for v in parser.links if 'hreflang' in v}
        for code in data: assert alternate[code]==origin+'/'+code+('/'+topic if topic else ''), path
        assert alternate['x-default']==origin+'/en'+('/'+topic if topic else ''), path
        assert not any('noindex' in v.get('content','') for v in parser.meta if v.get('name')=='robots'), path
        assert any(v.get('property')=='og:url' and v.get('content')==origin+path for v in parser.meta), path
        assert parser.json and parser.json[0]['@graph'][0]['inLanguage']==language, path
sitemap=ElementTree.fromstring(get('/sitemap.xml'))
urls=[e.text for e in sitemap.findall('.//{*}loc')]
assert len(urls)==len(set(urls)), 'Duplicate sitemap URL'
assert all(origin+path in urls for path in paths), 'Missing sitemap URL'
robots=get('/robots.txt'); assert 'Disallow: /admin' in robots and 'Sitemap: '+origin+'/sitemap.xml' in robots
for path in ['/fr', '/ko/not-a-page', '/en/guides/not-a-guide']:
    try: get(path); raise AssertionError('Unknown page must return 404: '+path)
    except HTTPError as error: assert error.code==404, path
home=Page(); home.feed(get('/'))
assert '쿠피랩' in ''.join(home.text)
assert any(node.get('@type')=='WebSite' for value in home.json for node in value.get('@graph',[]))
print(f'PASS: {len(paths)} server-rendered pages, canonical/hreflang/JSON-LD, sitemap, robots, invalid-route 404s and homepage brand.')
