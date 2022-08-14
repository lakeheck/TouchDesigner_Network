"""
Extension classes enhance TouchDesigner components with python. An
extension is accessed via ext.ExtensionClassName from any operator
within the extended component. If the extension is promoted via its
Promote Extension parameter, all its attributes with capitalized names
can be accessed externally, e.g. op('yourComp').PromotedFunction().

Help: search "Extensions" in wiki
"""

from TDStoreTools import StorageManager
import random
import numpy as np
import TDFunctions as TDF

class ImageInstanceExt:
	"""
	ImageInstanceExt description
	"""
	def __init__(self, ownerComp):
		# The component to which this extension is attached
		self.ownerComp = ownerComp
		self.ownerComp.par.Noiseseed = random.random()*10000



	def Translate(self, tx, ty, tz):
		self.ownerComp.par.Worldspaceposx = tx 
		self.ownerComp.par.Worldspaceposy = ty
		self.ownerComp.par.Worldspaceposz = tz
		return

	def LoadImage(self, path):
		op('moviefilein1').par.file = path

	def Cook(self, b = True):
		self.ownerComp.allowCooking = b
		return

