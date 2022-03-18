import json

from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework import status
from rest_framework import viewsets
from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from auth0api.auth0api import Auth0APIHelper

@swagger_auto_schema(
    methods=['get'],
    operation_summary='Get user detail.'
)
@api_view(['GET'])
def user_detail(request, uid):
    """Call Auth0 Api to get user detail."""
    helper = Auth0APIHelper()
    res = helper.getUserDetail(uid=uid)

    if request.method == 'GET':
        if res is not None:
            return JsonResponse(res)
        else:
            return HttpResponse(status=404)


@swagger_auto_schema(
    methods=['post'],
    operation_summary='Resend user varify mail.',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'user_id': openapi.Schema(type=openapi.TYPE_STRING, description='User id in Auth0 DB.'),
        }
    )
)
@api_view(['POST'])
def re_send_mail(request):
    """Call Auth0 Api to resend verify mail."""

    helper = Auth0APIHelper()
    uid = request.data.get('user_id')

    if request.method == 'POST':
        res = helper.reSendEmail(uid=uid)
        if res is not None:
            return JsonResponse(res)
        else:
            return HttpResponse(status=500)


@swagger_auto_schema(
    methods=['post'],
    operation_summary='Reset user password.',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'user_id': openapi.Schema(type=openapi.TYPE_STRING, description='User id in Auth0 DB.'),
            'username': openapi.Schema(type=openapi.TYPE_STRING, description='User login name.'),
            'password': openapi.Schema(type=openapi.TYPE_STRING, description='New password.'),
            'old_password': openapi.Schema(type=openapi.TYPE_STRING, description='Old password.'),
        }
    )
)
@api_view(['POST'])
def re_set_password(request):
    helper = Auth0APIHelper()
    uid = request.data.get('user_id')
    user_name = request.data.get('username')
    password = request.data.get('password')
    old_password = request.data.get('old_password')

    is_old_pass_correct = helper.isOldPasswordCorrect(user_name=user_name, password=old_password)
    if not is_old_pass_correct:
        return JsonResponse('Your old password not correct!', safe=False, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        res = helper.reSetPassword(uid=uid, password=password)
        if res is not None:
            return JsonResponse(res, safe=False, status=status.HTTP_200_OK)
        else:
            return JsonResponse('Service fail!', safe=False, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
