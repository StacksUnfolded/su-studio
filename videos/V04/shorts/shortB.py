from rs import *
A=lambda c,x=540,y=1650,h=800,**k: dict(c=c,x=x,y=y,h=h,**k)
Pp=lambda c,x,y,h,**k: dict(c=c,x=x,y=y,h=h,**k)
S=[dict(t=0,plate='G:navy',actors=[A('P09')],tr='none'),
 dict(t=3.8,plate='L02',fx=0.3,actors=[A('P22')],night=True),
 dict(t=6.2,plate='L01',fx=0.5,actors=[A('P13')]),
 dict(t=8.0,plate='L03',fx=0.5,actors=[A('P22')]),
 dict(t=13.1,plate='G:teal',actors=[A('P07')]),
 dict(t=15.5,plate='G:teal',actors=[A('P12')]),
 dict(t=18.2,plate='G:red',actors=[A('P21')],motion='punch'),
 dict(t=20.2,plate='L03B',fx=0.55,actors=[A('P17')],props=[Pp('parcel',250,1150,170,t=23.4),Pp('phone',830,1150,190,t=24.2),Pp('calendar',540,1080,200,t=26.4)]),
 dict(t=28.0,plate='G:red',actors=[A('P15',h=640,enter='drop')]),
 dict(t=33.2,plate='L07',fx=0.5,actors=[A('P23')]),
 dict(t=38.9,plate='G:gold',actors=[A('P09')]),
 dict(t=42.7,plate='G:navy',actors=[A('P02')])]
K=[(0,168),(4.3,112),(7.2,72),(11.9,32),(14.4,30),(22.0,30),(23.4,20),(24.3,12),(26.6,3),(33.2,3),(38.9,30),(42.7,168)]
Ly=[dict(kind='count',t0=0,t1=18.2,keys=K),
 dict(kind='tag',t0=4.3,t1=6.2,text='- SLEEP 56',y=575,col=(150,170,230)),
 dict(kind='tag',t0=7.2,t1=8.0,text='- JOB 40',y=575,col=(200,200,210)),
 dict(kind='tag',t0=11.8,t1=13.1,text='- EVERYTHING ELSE ~40',y=575,col=(220,190,150)),
 dict(kind='tag',t0=16.6,t1=18.2,text="YOUR HUSTLE'S ENTIRE BUDGET",y=600),
 dict(kind='big',t0=18.4,t1=20.2,text='THE CRUEL PART',size=150,col=WHITE),
 dict(kind='count',t0=20.2,t1=28.0,keys=K),
 dict(kind='big',t0=28.6,t1=33.2,text='THE TIME WALL',size=170,col=WHITE,y=320),
 dict(kind='tag',t0=34.3,t1=38.9,text='1. RAISE PRICES',y=200),
 dict(kind='tag',t0=35.5,t1=38.9,text='2. DROP WORST CUSTOMERS',y=300),
 dict(kind='tag',t0=37.3,t1=38.9,text='3. AUTOMATE THE BORING STUFF',y=400),
 dict(kind='big',t0=39.9,t1=42.7,text='NOT THE IDEA.',size=140,col=WHITE,y=260),
 dict(kind='big',t0=41.4,t1=42.7,text='THE HOURS.',size=160,col=GOLD,y=430),
 dict(kind='src',t0=0,t1=15.5,text='Illustrative week')]
SF=[('tick',0.2),('whoosh',3.8),('drag',4.3),('whoosh',6.2),('drag',7.2),('whoosh',8.0),('drag',11.9),('ding',14.4),('whoosh',18.2),('thump',18.6),('whoosh',20.2),('pop',23.4),('phone',24.2),('pop',26.4),('wrong',26.6),('thump',28.3),('violin',29.8),('whoosh',33.2),('pop',34.3),('pop',35.5),('pop',37.3),('whoosh',38.9),('stamp',41.4),('riser',43.0)]
frame,TOT=run('shortB','B',S,Ly,SF,caps_off=[(28.6,30.0)])
if __name__=='__main__':
    import sys
    if sys.argv[1]=='test':
        for x in sys.argv[2:]: frame(float(x)).save(f'qa_B_{x}.jpg',quality=80)
    else: render(frame,TOT,'B_video.mp4'); mix('shortB',SF,TOT,'B_audio.m4a')
