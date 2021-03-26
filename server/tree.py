import os
import json

class TreeNode(dict):
    def __init__(self,itemType,name,absolutePath):
        self.__dict__ = self
        self.name = name
        self.absolutePath = absolutePath
        self.itemType = itemType
        self.children = []
    

class Tree():
    def __init__(self):
        self.head = self.constructFolder('userFiles','userFiles')
    
    def constructFolder(self,folderName,path):
        current = TreeNode('folder',folderName,path)
        for item in os.listdir(path):
            itemPath = os.path.join(path,item)
            if(os.path.isdir(itemPath)):
                current.children.append(self.constructFolder(item,itemPath))
            else:
                current.children.append(TreeNode('file',item,itemPath))
        return current
    
    def printTree(self,current,subCount):
        for item in current.children:
            for i in range(subCount):
                print(" ",end='')
            print(item.name)
            if(item.itemType=='folder'):
                self.printTree(item,subCount+1)
            
    def getTree(self):
        return json.dumps(self.head, indent=2)
