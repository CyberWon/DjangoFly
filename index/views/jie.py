from django.http.response import HttpResponse
from django.template import loader


def JieIndex(request):
    # 文章列表
    template = loader.get_template('jie/index.html')
    context = {}
    return HttpResponse(template.render(context, request))


def JieAdd(request):
    # 添加文章
    template = loader.get_template('jie/add.html')
    context = {}
    return HttpResponse(template.render(context, request))


def JieDetail(request):
    # 文章详情
    template = loader.get_template('jie/detail.html')
    context = {}
    return HttpResponse(template.render(context, request))
