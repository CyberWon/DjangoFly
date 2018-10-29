from django.urls import path
from index.views import home, user, jie, other

urlpatterns = [
    path('user/', user.UserHome),
    path('user/index/', user.UserIndex),
    path('user/login/', user.UserLogin),
    path('user/reg/', user.UserReg),
    path('user/forget/', user.UserForget),
    path('user/message/', user.UserMessage),
    path('user/set/', user.UserSet),
    path('jie/', jie.JieIndex),
    path('jie/add/', jie.JieAdd),
    path('jie/detail/', jie.JieDetail),
    path('case/', other.Case),
    path('tips/', other.Tips),
    path('notice/', other.Notice),
    path('', home.HomeIndex),
]
