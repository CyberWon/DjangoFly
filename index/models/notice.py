from django.db import models


class Notice(models.Model):

    title = models.CharField(max_length=100,help_text="公告标题",verbose_name="公告标题")
    content = models.TextField(verbose_name="公告内容",help_text="公告内容")
    created_time = models.DateTimeField(verbose_name="创建时间",help_text="创建时间")
    updated_time = models.DateTimeField(verbose_name="更新时间",help_text="更新时间")
    status = models.IntegerField(verbose_name="公告状态",help_text="公告状态")