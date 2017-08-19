import glob, os, random, sys, socket
from useful_functions import *


def generateTrials(runTimeVars,runTimeVarsOrder):
	print "runTimeVars = "
	print runTimeVars

	print "runTimeVarsOrder = "
	print runTimeVarsOrder

	if not runTimeVars['subjCode']:
		sys.exit('Please provide subject code as subjCode')
	try:
		random.seed(int(seed))
	except:
		pass
	standardsFilenames = glob.glob('public/stimuli/*png')
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
	print "start"
	print "numIters = " + str(numIters)
	for iter in range(numIters):
		print "bases = " + str(bases)
		for curBase in bases:
			print "frames = " + str(frames)
			for curFrame in frames[runTimeVars['frame']]:
				print "orientations = " + str(orientations)
				for curOri in orientations[runTimeVars['ori']]:
					print "directions = " + str(directions)
					for curDirection in directions:
						print "tilts = " + str(tilts)
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
							print curTrialIndex
	
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
	subjCode = sys.argv[1]
	room = socket.gethostname().upper()
	# generateTrials({'subjCode':'testSubj', 'seed':2, 'frame':'basic', 'ori':'all'}, ['subjCode', 'seed', 'frame', 'ori'])	
	print generateTrials(
	{
		'lang': 'e',
		'date_time': '2017-08-17 22:30', 
		'expName': 'tiltH_blocked', 
		'seed': 10, 
		'room': room, 
		'subjCode': subjCode, 
		'frame': 'basic', 
		'ori': 'all', 
		'respMapping': 'upLeft'
	},
	['subjCode', 'lang', 'seed', 'frame', 'ori', 'respMapping', 'room', 'date_time', 'expName']
	)
	#use of kwargs optional
	#def generateTrials(**runTimeVars):
	
