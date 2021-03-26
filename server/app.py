import os
import flask
from tree import Tree
import subprocess
from shutil import rmtree
from flask import request,jsonify
from flask_cors import CORS

app = flask.Flask(__name__)
app.config["DEBUG"] = True
CORS(app)


@app.route('/folderManager', methods=['GET'])
def home():
    # Get list of files
    if(request.method=='GET'):
        tree = Tree()
        return tree.getTree()
        
    # Create
    if(request.method=='POST'):
        return "Yet to be implemented"
    
    # Delete folder and contents
    if(request.method=='DELETE'):
        rmtree(request.json['folderName'])
        return "Successfully deleteed folder"
    
    # Move
    if(request.method=='PATCH'):
        return "Yet to be implemented"  


@app.route('/fileManager',methods=['GET','POST','PUT','DELETE','HEAD','PATCH'])
def fileManager():
    # Read
    if(request.method=='GET'):
        absolutePath = request.args.get('absolutePath')
        file = open(absolutePath,'r')
        contents = file.read()
        file.close()
        return jsonify(contents)
    
    # Create
    if(request.method=='POST'):
        newFile = open(request.json['name'], "w")
        newFile.write(request.json['program'])
        newFile.close()
        return 'Successfully Created File'

    # Update
    if(request.method=='PUT'):
        existingFile = open(request.json['name'],'r')
        existingFile.truncate(0)
        existingFile.write(request.json['program'])
        existingFile.close()
        return 'Wrote succesfully'
    
    # Delete
    if(request.method=='DELETE'):
        os.remove(request.json['name'])
        return 'Successfully Deleted File'

    # Execute
    if(request.method=='HEAD'):
        process = subprocess.Popen(['python',request.json['name']],stdout=subprocess.PIPE)
        return process.communicate()[0]
    
    # Move
    if(request.method=='PATCH'):
        return "Yet to be implemented"

app.run()


