from django.http import HttpResponse
from django.shortcuts import render 
def about (request):
    return render (request,'about.html')
    #return HttpResponse('about')
def homepage (request):
    #return HttpResponse('yoda_you made it work')
    return render (request,'homepage.html')