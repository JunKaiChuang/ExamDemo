import json

from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework import status
from rest_framework import viewsets
from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from auth0api.auth0api import Auth0APIHelper


def user_detail(request, uid):
    helper = Auth0APIHelper()
    res = helper.getUserDetail(uid=uid)

    if request.method == 'GET':
        if res is not None:
            return JsonResponse(res)
        else:
            return HttpResponse(status=404)


def re_send_mail(request):
    helper = Auth0APIHelper()
    uid = request.POST.get('user_id', '')

    if request.method == 'POST':
        res = helper.reSendEmail(uid=uid)
        if res is not None:
            return JsonResponse(res)
        else:
            return HttpResponse(status=500)


def re_set_password(request):
    helper = Auth0APIHelper()
    uid = request.POST.get('user_id', '')
    user_name = request.POST.get('username', '')
    password = request.POST.get('password', '')
    old_password = request.POST.get('old_password', '')

    is_old_pass_correct = helper.isOldPasswordCorrect(user_name=user_name, password=old_password)
    if not is_old_pass_correct:
        return JsonResponse('Your old password not correct!', safe=False)
    else:
        res = helper.reSetPassword(uid=uid, password=password)
        if res is not None:
            return JsonResponse(res, safe=False)
        else:
            return JsonResponse('Service fail!', safe=False)
