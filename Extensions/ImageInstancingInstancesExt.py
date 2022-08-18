
"""
Extension classes enhance TouchDesigner components with python. An
extension is accessed via ext.ExtensionClassName from any operator
within the extended component. If the extension is promoted via its
Promote Extension parameter, all its attributes with capitalized names
can be accessed externally, e.g. op('yourComp').PromotedFunction().

Help: search "Extensions" in wiki
"""

from TDStoreTools import StorageManager
import TDFunctions as TDF
import random
import numpy as np

class ImageInstancingInstances:
	"""
	ImageInstancingInstances description
	"""
	def __init__(self, ownerComp):
		self.ownerComp = ownerComp
		self.Instances = self.ownerComp.ops('image_instance*')
		# self.Instances=self.Instances
		self.Camera = op('cam1')
		self.CameraLoc = np.array((self.Camera.par.tx, self.Camera.par.ty, self.Camera.par.tz))

		self.StartingLoc() #init no expansion

	def StartingLoc(self):
		for i in range(len(self.Instances)):
			self.Instances[i].par.Posmode = 1
			self.Instances[i].par.Worldspaceposx = np.random.random()*300-150
			self.Instances[i].par.Worldspaceposy = np.random.random()*300-150
			self.Instances[i].par.Worldspaceposz = np.random.random()*50+50
			self.Instances[i].par.Expand = 0


	def MoveInstances(self):
		t = 0

		self.Camera.par.lookat = op('null3')

		for i in self.Instances: 
			tx = random.gauss(0, 50)
			ty = random.gauss(0, 50)
			tz = random.gauss(0, 50)
			i.Translate(tx, ty, tz)
			t +=1 
		


		# self.MoveCam()

		return 

	def MoveCam(self): 
			self.Camera.Translate()

	def Expand(self, b = True, idx=None, idxList = []):
		if len(idxList) > 0:
				for id in idxList: self.Instances[id].par.Expand = b
		else: 
			for i in self.Instances: 
				i.par.Expand = b
		return

	def Pause(self, idxList = []):
		if len(idxList) > 0:
				for id in idxList: self.Instances[id].par.Expand = False
		else: 
			for i in self.Instances: 
				i.par.Expand = False
		return

	def Toggle(self, idxList = []):
		if len(idxList) > 0:
				for id in idxList: self.Instances[id].par.Expand = False if self.Instances[id].par.Expand else True 
		else: 
			for i in self.Instances: 
				i.par.Expand = False if i.par.Expand else  True
		return	

	def Origin(self):
		
		self.Camera.par.lookat = op('origin')

		for i in range(len(self.Instances)):
			self.Instances[i].par.Posmode = 1
			self.Instances[i].par.Worldspaceposx = -25 + 12.5*i
			self.Instances[i].par.Worldspaceposy = 0
			self.Instances[i].par.Worldspaceposz = 0
			self.Instances[i].par.Delay = i*5


	