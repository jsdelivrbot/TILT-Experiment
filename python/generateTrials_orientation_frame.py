import glob, os, random, sys
from useful_functions import *


def generateTrials(runTimeVars,runTimeVarsOrder):
	if not runTimeVars['subjCode']:
		sys.exit('Please provide subject code as subjCode')
	try:
		random.seed(int(seed))
	except:
		pass
	standardsFilenames = glob.glob('stimuli/*png')
	standardsFilenames = [os.path.splitext(os.path.basename(_))[0] for _ in standardsFilenames if len(os.path.splitext(os.path.basename(_))[0].split('_'))==4]
	bases = set([_.split('_')[0] for _ in standardsFilenames])
	print 'possible bases',bases
	directions = set([_.split('_')[3] for _ in standardsFilenames])
	frames = {'basic-full':['basic','full'], 'basic':['basic'],'full':['full'], 'none':['none'], 'both':['full','none']}
	orientations = {'CLCL':['upright','inverted'], '9L9L':['upright','inverted'], 'all':['upright','inverted']}
	if runTimeVars['ori']=='all':
		bases=['CLCL','9L9L']
	elif runTimeVars['ori']=='CLCL':
		bases = ['CLCL']
	elif runTimeVars['ori']=='9L9L':
		bases = ['9L9L']

	tilts = range(2,14,2)
	standardStimPos, adjustingStimPos = (0,0), (0,-150) #jitter the standard position as well
	adjustStimXJitter = 15
	if len(bases)==1:
		numIters=5
		if len(frames[runTimeVars['frame']])>1:
			numIters=3
	elif len(bases)<3:
		numIters=2
	else:
		numIters=1

	print 'there are', numIters, 'iterations'
	trialInfo=[]
	curTrialIndex=0
	for iter in range(numIters):
		for curBase in bases:
			for curFrame in frames[runTimeVars['frame']]:
				for curOri in orientations[runTimeVars['ori']]:
					for curDirection in directions:
						for curTilt in tilts:
							trialInfo.append([])
							curStandard = "_".join([str(curBase), str(curOri), str(curTilt), str(curDirection)])
							for curRuntimeVar in runTimeVarsOrder:
								trialInfo[curTrialIndex].append(runTimeVars[curRuntimeVar])
			
							#now include the independent vars
							curAdjustingStimPos = (random.randrange(-adjustStimXJitter, adjustStimXJitter)+adjustingStimPos[0], adjustingStimPos[1])
							curStandardStimPos = (random.randrange(-adjustStimXJitter, adjustStimXJitter)+standardStimPos[0], standardStimPos[1])
							trialInfo[curTrialIndex].extend([curStandard, curBase, curFrame, curTilt,curDirection,curOri, 'gabor', curStandardStimPos, curAdjustingStimPos])
							curTrialIndex+=1
	
	random.shuffle(trialInfo)

	outputFile = open('trials/'+runTimeVars['subjCode']+'_trials.txt','w')
	header = runTimeVarsOrder
	header.extend (['standardStim', 'textShown', 'frame', 'tilt', 'direction', 'orientation', 'adjustingStim', 'standardStimPos', 'adjustingStimPos'])

	writeToFile(outputFile,header,writeNewLine=True)
	for curTrial in trialInfo:
		writeToFile(outputFile,curTrial,writeNewLine=True)
	outputFile.close()

	return True
if __name__ == '__main__':
	generateTrials({'subjCode':'testSubj', 'seed':2, 'frame':'basic', 'ori':'all'}, ['subjCode', 'seed', 'frame', 'ori'])	
	#use of kwargs optional
	#def generateTrials(**runTimeVars):
	