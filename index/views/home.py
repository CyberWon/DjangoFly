from django.http.response import HttpResponse
from django.template import loader


def HomeIndex(request):
    # 网站首页
    template = loader.get_template('index.html')
    context = {}
    return HttpResponse(template.render(context, request))


