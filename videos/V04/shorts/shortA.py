from rs import *
A=lambda c,x=540,y=1650,h=800,**k: dict(c=c,x=x,y=y,h=h,**k)
Pp=lambda c,x,y,h,**k: dict(c=c,x=x,y=y,h=h,**k)
S=[dict(t=0,plate='L04',fx=0.35,actors=[A('P18')],tr='none'),
 dict(t=3.4,plate='L04',fx=0.35,actors=[A('P20')],motion='punch'),
 dict(t=4.4,plate='G:navy',actors=[A('P09')]),
 dict(t=7.0,plate='G:navy',actors=[A('P12')]),
 dict(t=9.6,plate='G:navy',actors=[A('P12')],props=[Pp('clock',860,1050,220,t=9.7)]),
 dict(t=10.8,plate='G:red',actors=[A('P08',enter='pop')],motion='punch'),
 dict(t=13.5,plate='L01',fx=0.5,actors=[A('P07')]),
 dict(t=19.5,plate='G:teal',actors=[A('P02')]),
 dict(t=25.1,plate='G:teal',actors=[A('C04',x=320,h=760),A('P07',x=780,h=760,t=27.5)]),
 dict(t=29.8,plate='L04',fx=0.35,actors=[A('P23')]),
 dict(t=32.75,plate='L04',fx=0.35,actors=[A('P18')],tr='none')]
Ly=[dict(kind='big',t0=0.9,t1=3.4,text='$200',size=220,col=GOLD),
 dict(kind='big',t0=3.5,t1=4.4,text='NICE!',size=180,col=WHITE),
 dict(kind='big',t0=4.8,t1=7.0,text='THE MATH NOBODY POSTS',size=110,col=WHITE),
 dict(kind='big',t0=7.1,t1=9.6,text='$200 ÷ HOURS',size=150,col=WHITE),
 dict(kind='big',t0=9.7,t1=10.8,text='$200 ÷ 20 HRS',size=140,col=WHITE),
 dict(kind='big',t0=10.9,t1=13.5,text='= $10/HR',size=220,col=GOLD),
 dict(kind='stamp',t0=11.2,t1=13.5,x=540,y=520),
 dict(kind='tag',t0=13.6,t1=19.5,text='NO BOSS',y=210,col=GREEN),
 dict(kind='tag',t0=15.4,t1=19.5,text='NO SICK DAYS',y=310,col=RED),
 dict(kind='tag',t0=16.4,t1=19.5,text='NO GUARANTEED PAY',y=410,col=RED),
 dict(kind='tag',t0=17.6,t1=19.5,text='NOBODY TO COMPLAIN TO',y=510,col=RED),
 dict(kind='big',t0=20.0,t1=25.1,text='$200/MONTH',size=170,col=GOLD,y=300),
 dict(kind='tag',t0=21.3,t1=25.1,text='= THE MEDIAN SIDE HUSTLER',y=450),
 dict(kind='src',t0=23.0,t1=29.8,text='Source: Bankrate side hustle survey, June 2025'),
 dict(kind='bars2',t0=25.1,t1=29.8,items=[('MEDIAN',200,'$200',(150,170,190),25.2),('AVERAGE',885,'$885',GOLD,25.9)]),
 dict(kind='big',t0=31.3,t1=32.75,text='CHECK YOUR HOURLY RATE',size=110,col=GOLD)]
SF=[('register',1.9),('ding',3.5),('whoosh',4.4),('pop',7.1),('tick',9.7),('wrong',11.0),('stamp',11.2),('pop',13.6),('wrong',15.4),('wrong',16.4),('wrong',17.6),('whoosh',19.5),('pop',20.0),('pop',25.2),('riser',25.4),('ding',26.6),('whoosh',29.8),('stamp',31.4)]
frame,TOT=run('shortA','A',S,Ly,SF,caps_off=[(0.9,3.4),(10.9,13.4)])
if __name__=='__main__':
    import sys
    if sys.argv[1]=='test':
        for x in sys.argv[2:]: frame(float(x)).save(f'qa_A_{x}.jpg',quality=80)
    else: render(frame,TOT,'A_video.mp4'); mix('shortA',SF,TOT,'A_audio.m4a')
