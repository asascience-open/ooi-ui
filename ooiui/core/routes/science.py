#!/usr/bin/env python
'''
ooiui.core.routes.science

Defines the application routes
'''
from ooiui.core.app import app
from flask import request, render_template, Response, jsonify



import requests
import os
import json
from datetime import datetime,timedelta
import time
import numpy as np
import math

@app.route('/')
def new_index():    
    return render_template('science/index.html')

@app.route('/landing/pioneer')
def landing_pioneer():
    return render_template('landing/pioneer.html')

@app.route('/assets/platforms')
@app.route('/assets/platforms/')
def plat_index():
    return render_template('asset_management/platform_list.html')

@app.route('/assets/instruments')
@app.route('/assets/instruments/')
def instr_index():
    return render_template('asset_management/instrument_list.html')

@app.route('/getdata/')
def getData():
    '''
    gets data in the google chart format
    '''
    instr = request.args['instrument']   
    stream = request.args['stream'] 
    field = request.args['field']    
     
    #std = request.args['startdate']
    #edd = request.args['enddate']
    #param = request.args['variables']
    ann = "?annotation=true"
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/get_data'+"/"+instr+"/"+stream+ann+"&field="+field, params=request.args)
    return response.text, response.status_code


@app.route('/api/array')
def array_proxy():
    response = requests.get(app.config['SERVICES_URL'] + '/arrays', params=request.args)
    return response.text, response.status_code

@app.route('/api/platform_deployment')
def platform_deployment_proxy():
    response = requests.get(app.config['SERVICES_URL'] + '/platform_deployments', params=request.args)
    return response.text, response.status_code

@app.route('/api/instrument_deployment', methods=['GET'])
def instrument_deployment_proxy():
    response = requests.get(app.config['SERVICES_URL'] + '/instrument_deployment', params=request.args)
    return response.text, response.status_code

@app.route('/api/instrument_deployment/<int:id>', methods=['PUT'])
def instrument_deployment_put(id):
    response = requests.put(app.config['SERVICES_URL'] + '/instrument_deployment/%s' % id, data=request.data)
    return response.text, response.status_code

@app.route('/api/instrument_deployment', methods=['POST'])
def instrument_deployment_post():
    response = requests.post(app.config['SERVICES_URL'] + '/instrument_deployment', data=request.data)
    return response.text, response.status_code

@app.route('/api/instrument_deployment/<int:id>', methods=['DELETE'])
def instrument_deployment_delete(id):
    response = requests.delete(app.config['SERVICES_URL'] + '/instrument_deployment/%s' % id, data=request.data)
    return response.text, response.status_code

@app.route('/opLog.html')
def op_log():
    return render_template("common/opLog.html")

@app.route('/api/uframe/stream')
def stream_proxy():
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/stream', params=request.args)
    return response.text, response.status_code
