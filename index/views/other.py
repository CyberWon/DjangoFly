from django.http.response import HttpResponse
from django.template import loader


def Case(request):
    # 文章详情
    template = loader.get_template('case/case.html')
    context = {}
    return HttpResponse(template.render(context, request))

def Tips(request):
    # 文章详情
    template = loader.get_template('other/tips.html')
    context = {}
    return HttpResponse(template.render(context, request))

def Notice(request):
    # 文章详情
    template = loader.get_template('other/notice.html')
    context = {}
    return HttpResponse(template.render(context, request))

def error404(request):
    # 文章详情
    template = loader.get_template('other/404.html')
    context = {}
    return HttpResponse(template.render(context, request))