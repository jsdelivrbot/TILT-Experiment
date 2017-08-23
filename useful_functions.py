import os, glob, math
import socket
import datetime
 
def importTrials(trialsFilename, colNames=None, separator='\t'):
	try:
		trialsFile = open(trialsFilename, 'rb')
	except IOError:
		print trialsFilename, 'is not a valid file'
	
	if colNames is None: # Assume the first row contains the column names
		colNames = trialsFile.next().rstrip().split(separator)
	trialsList = []
	for trialStr in trialsFile:
		trialList = trialStr.rstrip().split(separator)
		assert len(trialList) == len(colNames)
		trialDict = dict(zip(colNames, trialList))
		trialsList.append(trialDict)
	return trialsList


def importTrialsWithHeader(trialsFilename, colNames=None, separator='\t', header=True):
	try:
		trialsFile = open(trialsFilename, 'rb')
	except IOError:
		print trialsFilename, 'is not a valid file'
	
	if colNames is None: # Assume the first row contains the column names
		colNames = trialsFile.next().rstrip().split(separator)
	trialsList = []
	for trialStr in trialsFile:
		trialList = trialStr.rstrip().split(separator)
		assert len(trialList) == len(colNames)
		trialDict = dict(zip(colNames, trialList))
		trialsList.append(trialDict)
	if header:
		return (colNames, trialsList)
	else:
		return trialList

def printHeader(header,headerFile='header.txt',separator="\t", overwrite=False):
	if overwrite or (not overwrite and not os.path.isfile(headerFile)):
		headerFile = open('header.txt','w')
		writeToFile(headerFile,header,writeNewLine=True)
		return True
	else:
		return False		

def evaluateLists(trialList):
	assert isinstance(trialList,list)
	for curTrial in trialList:
		assert isinstance(curTrial,dict)
		for key,value in curTrial.items():
			try:
				if isinstance(eval(curTrial[key]),list) or isinstance(eval(curTrial[key]),dict) or isinstance(eval(curTrial[key]),tuple):
					curTrial[key]=eval(value)
			except:
				pass
	return trialList

	
def getSubjCode(preFilledInText=''):
	 userVar = {'subjCode':preFilledInText}
	 dlg = gui.DlgFromDict(userVar)
	 return userVar['subjCode']

def openOutputFile(subjCode,suffix):
	if  os.path.isfile(subjCode+'_'+suffix+'.txt'):
		popupError('Error: That subject code already exists')
		return False
	else:
		try:
			outputFile = open(subjCode+'_'+suffix+'.txt','w')
		except:
			print 'could not open file for writing'
		return outputFile

def writeToFile(fileHandle,trial,separator='\t', sync=True,writeNewLine=False):
	"""Writes a trial (array of lists) to a previously opened file"""
	line = separator.join([str(i) for i in trial]) #TABify
	if writeNewLine:
		line += '\n' #add a newline
	try:
		fileHandle.write(line)
	except:
		print 'file is not open for writing'
	if sync:
			fileHandle.flush()
			os.fsync(fileHandle)
			
def polarToRect(angleList,radius):
	"""Accepts a list of angles and a radius.  Outputs the x,y positions for the angles"""
	coords=[]
	for curAngle in angleList:
		radAngle = (float(curAngle)*2.0*math.pi)/360.0
		xCoord = round(float(radius)*math.cos(radAngle),0)
		yCoord = round(float(radius)*math.sin(radAngle),0)
		coords.append([xCoord,yCoord])
	return coords
					
def euclidDistance(pointA,pointB):
	return math.sqrt((pointA[0]-pointB[0])**2 + (pointA[1]-pointB[1])**2)

	#optionally check a list of desired stimuli against those that've been loaded
	if stimList and set(fileMatrix.keys()).intersection(stimList) != set(stimList):
		popupError(str(set(stimList).difference(fileMatrix.keys())) + " does not exist in " + path+'\\'+directory) 
	return fileMatrix