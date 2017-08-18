from psychopy import core, visual, prefs, event
import random, sys
from useful_functions import *
from generateTrials_orientation_frame import *
import webbrowser as web
import socket
import datetime


class Exp:
	def __init__(self):
		self.maxDegree=20
		self.numPracticeTrials = 8
		self.instructions={
				'e' : "Thank you for participating! In this short study you will be seeing some shapes in the middle of the screen that are tilted to the left or right. Your task is to adjust a white bar below the shapes so that its tilt matches that of the shapes. Use the mouse-wheel to adjust the tilt of the bar. When you are satisfied, press the left mouse button to proceed to the next trial. You will start with some practice trials to get the hang of the task. Try to be as accurate as you can, but don't spend too much time on any one trial.",
				'h' : "Translate to Hebrew: Thank you for participating! In this short study you will be seeing some shapes in the middle of the screen that are tilted to the left or right. Your task is to adjust a white bar below the shapes so that its tilt matches that of the shapes. Use the mouse-wheel to adjust the tilt of the bar. When you are satisfied, press the left mouse button to proceed to the next trial. You will start with some practice trials to get the hang of the task. Try to be as accurate as you can, but don't spend too much time on any one trial. Press Enter when Ready"
		}
		self.surveyURL = 'https://docs.google.com/forms/d/1rg_sf55XnPOtv7ad4ESuxUpso1X5c_SvkbCL2B6hRzo/viewform'
		
		self.get_runtime_vars()
		self.win = visual.Window(fullscr=True,color='#333534', units='pix')
		self.myMouse = event.Mouse()
		self.myMouse.setVisible(0)
		self.adjustStim = visual.GratingStim(win=self.win,tex='sin', mask='gauss',interpolate=True, size=[8,96], color="white")
		self.pics =  loadFiles('stimuli','.png','image', win=self.win)
		self.rectFrame = visual.Rect(win=self.win,size=(215*2,71*2), lineColor="darkgray", lineWidth=2, fillColor=None)
		
	def get_runtime_vars(self):
		while True:
			runTimeVarOrder = ['subjCode','lang','seed', 'frame', 'ori', 'respMapping','room','date_time']
			self.runTimeVars = getRunTimeVars(
									{'subjCode':'tiltH_101', 'seed':10, \
									'lang': ['Choose', 'e','h'], \
									'frame': ['basic', 'basic-full','both', 'full', 'none'], \
									'ori': ['all','9L9L', 'CLCL'], \
									'respMapping': ['Choose', 'upLeft', 'upRight'], \
									'room': socket.gethostname().upper(),\
									'date_time':datetime.datetime.now().strftime("%Y-%m-%d %H:%M")},\
									runTimeVarOrder,'tiltH_blocked')
			if 'Choose' in self.runTimeVars.values():
				popupError('Need to choose a value from a dropdown box')
			else:
				self.outputFile = openOutputFile('data/'+self.runTimeVars['subjCode'],'tilt')
				if self.outputFile:
					break
		
		try:
			print 'generating trials...'
			generateTrials(self.runTimeVars,runTimeVarOrder)
		except:
			sys.exit('Something went wrong with trial generation')

		(self.header,self.trialInfo) = importTrialsWithHeader('trials/'+self.runTimeVars['subjCode']+'_trials.txt')
		self.trialInfo = evaluateLists(self.trialInfo)
		printHeader(self.header+['trialType', 'numWheelTurnsUp','numWheelTurnsDown','response', 'absResponse', 'rt'])
		self.surveyURL += '?entry.900342216=%s&entry.142747125=%s' % (self.runTimeVars['subjCode'], self.runTimeVars['room'])


	def cycleThroughTrials(self,trialType,curTrial):
		curTrial['header']=self.header
		self.pics['alarmClock']['stim'].setPos(curTrial['standardStimPos'])
		self.rectFrame.setPos(curTrial['standardStimPos'])
		self.pics[curTrial['standardStim']]['stim'].setPos(curTrial['standardStimPos'])
		self.adjustStim.setPos(curTrial['adjustingStimPos'])
		self.adjustStim.setOri(0)
		self.win.flip()
		numWheelTurnsDown=numWheelTurnsUp=0
		responded=False
		curOri=0
	
		timer = core.Clock()
		while not responded:
			while self.myMouse.getPressed()[0]==0:
				self.pics[curTrial['standardStim']]['stim'].draw()
				self.adjustStim.draw()
				if curTrial['frame']=="full":
					self.pics['alarmClock']['stim'].draw()
				if curTrial['frame']=="basic":
					self.rectFrame.draw()
				self.win.flip()
				wheelRel = self.myMouse.getWheelRel()[1]
				
				if self.runTimeVars['respMapping']=="upLeft":				
					if wheelRel>0.0 and curOri>-self.maxDegree:
						numWheelTurnsDown+=1
						curOri-=1
						self.adjustStim.setOri(curOri)
					elif wheelRel<0.0 and curOri<self.maxDegree:
						numWheelTurnsUp+=1
						curOri+=1
						self.adjustStim.setOri(curOri)
				elif self.runTimeVars['respMapping']=="upRight":
					if wheelRel>0.0 and curOri<self.maxDegree:
						numWheelTurnsDown+=1
						curOri+=1
						self.adjustStim.setOri(curOri)
					elif wheelRel<0.0 and curOri>-self.maxDegree:
						numWheelTurnsUp+=1
						curOri-=1
						self.adjustStim.setOri(curOri)

				if self.myMouse.getPressed()[0]==1 and (numWheelTurnsUp>0 or numWheelTurnsDown>0):
					RT = timer.getTime()*1000
					responded=True

		#write runtime and indep variables to 
		responses=[curTrial[_] for _ in curTrial['header']]
	
		#write dep variables
		responses.extend(
			[trialType,
			numWheelTurnsUp,
			numWheelTurnsDown,
			curOri,
			abs(curOri),
			RT])
		writeToFile(self.outputFile,responses,writeNewLine=True)

	def showInstructions(self,instructions):
		visual.TextStim(win=self.win,text=instructions,color="white",height=30).draw()
		self.win.flip()
		event.waitKeys(keyList=['enter','return'])

	def showText(self, text):
		visual.TextStim(win=self.win,text=text,color="white",height=30).draw()
		self.win.flip()
		event.waitKeys(keyList=['enter','return'])

		
def runStudy():
	exp = Exp()
	exp.showInstructions(exp.instructions[exp.runTimeVars['lang']])
	for curTrial in random.sample(exp.trialInfo,exp.numPracticeTrials):
		exp.cycleThroughTrials("practice", curTrial)
	exp.showText("Now for the real trials. Press enter to proceed")
	for curTrial in exp.trialInfo:
		exp.cycleThroughTrials("real", curTrial)
	exp.showText("Thank you! Please press enter to complete short questionnaire.")
	web.open(exp.surveyURL)

runStudy()