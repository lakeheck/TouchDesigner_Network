"""
Extension classes enhance TouchDesigner components with python. An
extension is accessed via ext.ExtensionClassName from any operator
within the extended component. If the extension is promoted via its
Promote Extension parameter, all its attributes with capitalized names
can be accessed externally, e.g. op('yourComp').PromotedFunction().

Help: search "Extensions" in wiki
"""

import numpy as np 
import pandas as pd 

from TDStoreTools import StorageManager
import TDFunctions as TDF

class KeyframeImportExt:
	"""
	KeyframeImportExt description
	"""
	def __init__(self, ownerComp):
		# The component to which this extension is attached
		self.ownerComp = ownerComp
		self.File = self.ownerComp.par.Keyframeinfile
		self.attack_frames = 30
		self.decay_frames = 30

	def ImportKeyframes(self, file):
		df = pd.read_csv(file)
		#read channel names from file and create channel csv output
		chans = df['frame'].values[1:]
		chans = [[chans[i], i+1, 'hold', 'hold', 0, 'keys', 1,1,1,0,1,0] for i in range(len(chans))]
		cdf = pd.DataFrame(chans, columns = ['name', 'id', 'left', 'right', 'default', 'keys', 'liner', 'lineg', 'lineb', 'picked', 'display', 'template'])
		cdf.to_csv('channels.csv', index=False)

		#populate default values and clean data 
		#note this assumes the input file with have the following structure: 
		# - first columnn called 'frame' with channel names 
		# - second column called 'id' with unique IDs for each 
		# - third column called 'default' with the default values for each 
		# - all subsequent columns have the frame number as the column heading. values are the channel values at the resepctive frame 
		# the first row (after the 'header' row containing frames) should be an envelope index row: 
		# Envelope row index keys used below
		# 	-1 = release 
		# 	0 = attack /release
		# 	1 = attack 
		# 	2 = additive, no envelope

		defaults = df['default'].values[1:]
		vals = [r[3:] for r in df.values[1:]]
		envelop = df.values[0][3:]
		keyframes = df.columns.values[3:].astype(int)

		out = []

		for j in range(len(vals)):
			temp = []
			for i in range(len(vals[j])):
				x = keyframes[i] 
				y = vals[j][i]
				env = envelop[i]
				row = [j+1, x,y, 0, 0, 'cubic()', 0, 0]

				if env == 1: #attack
					start_env = [j+1, x-self.attack_frames, defaults[j], 0, 0, 'cubic()', 0, 0]
					temp += [start_env]
					temp += [row]
				elif env == -1: #decay
					end_env = [j+1, x-self.decay_frames, vals[j][i-1] if i>0 else defaults[j], 0, 0, 'cubic()', 0, 0]
					temp += [end_env]
					temp += [row]
					
				elif env == 0: #peak, both attack and decay
					start_env = [j+1, x-self.attack_frames, defaults[j], 0, 0, 'cubic()', 0, 0]
					end_env = [j+1, x+self.decay_frames, defaults[j], 0, 0, 'cubic()', 0, 0]
					temp += [start_env]
					temp += [row]
					temp += [end_env]
				else: #if we are just adding effects (I.E. dont want to fade to no fx but just add another)
					#then we want to populate end of envelope with values carried over from prior keyframe
					#unless that parameter is the one changing for this keyframe 

					end_env = [j+1, x-self.decay_frames, vals[j][i-1] if vals[j][i-1]==y else defaults[j], 0, 0, 'cubic()', 0, 0]
					temp += [end_env]
					temp += [row]
		
			out += temp
			
		outdf = pd.DataFrame(out, columns = ['id', 'x', 'y', 'inslope', 'inaccel', 'expression', 'outslope', 'outaccel'])
		outdf.to_csv('keyframes/keyframes_to_TD_mvmt_' + str(parent(4).digits) + '.csv', index=False)
		return


		