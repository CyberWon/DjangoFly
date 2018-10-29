from django.http.response import HttpResponse
from django.template import loader

def UserLogin(request):
    # 用户登录
    template = loader.get_template('user/login.html')
    context = {}
    return HttpResponse(template.render(context, request))


def UserHome(request):
    # 我的主页
    template = loader.get_template('user/home.html')
    context = {}
    return HttpResponse(template.render(context, request))


def UserIndex(request):
    # 用户中心
    template = loader.get_template('user/index.html')
    context = {}
    return HttpResponse(template.render(context, request))


def UserSet(request):
    # 基本设置
    template = loader.get_template('user/set.html')
    context = {}
    return HttpResponse(template.render(context, request))


def UserReg(request):
    # 用户注册
    template = loader.get_template('user/reg.html')
    context = {}
    return HttpResponse(template.render(context, request))


def UserForget(request):
    # 忘记密码
    template = loader.get_template('user/forget.html')
    context = {}
    return HttpResponse(template.render(context, request))


def UserMessage(request):
    # 我的消息
    template = loader.get_template('user/message.html')
    context = {}
    return HttpResponse(template.render(context, request))

def UserActivate(request):
    # 用户激活
    template = loader.get_template('user/activate.html')
    context = {}
    return HttpResponse(template.render(context, request))