# V05 narration: tagged for eleven_v4. Tags in [brackets] are performance cues, not spoken.
import re, sys, os
SECS = [
("sec00", "Cold open", """[tense] It's two in the morning, and your phone won't stop buzzing.

[fast] Payment failed. Payment failed. Late fee. Your bank account is in the negative. [disbelief] And somewhere in there is a reminder that your groceries… are past due.

[short pause] [deadpan] Yep. That's you.

Twelve "pay in four" plans. Across three apps. Two thousand, three hundred and forty dollars you owe… [sighs] on stuff you mostly don't even remember buying.

[curious] And the crazy part? It all started with a sixty-dollar pair of sneakers. No interest. No credit check. [sarcastic] Four easy payments.

So here's what we're figuring out today. Somewhere between that first sixty-dollar plan and this… there was one purchase where it stopped being a shortcut and became a trap.

[dramatically] Which one was it?

[short pause] [warmly] Let's go back to the beginning."""),

("sec01", "Level 1", """[curious] Level one. One plan.

You're scrolling late at night. Sneakers. Sixty dollars.

And right under the price, there's a button: four payments of fifteen dollars. Zero percent interest.

[thoughtful] Your brain does something very human here. It stops seeing sixty dollars. It only sees fifteen. And fifteen dollars is nothing. [chuckles] Fifteen dollars is a sandwich.

And signing up takes about thirty seconds. Name, phone number, debit card. Usually no hard credit check. [excited] Approved.

The first fifteen comes out today. The other three come out automatically, every two weeks, straight from your card. You don't have to remember anything. [warmly] That's the part that feels like magic.

[short pause] Tap.

[matter-of-fact] And honestly? At this level, buy now, pay later is kind of… fine. You pay it back on time, you pay zero interest. That's the deal. Plenty of people use it exactly like this, and nothing bad ever happens.

[curious] So who's paying for your free money?

Mostly the store. When you use pay in four, the store usually pays the app a fee on the sale. And stores are happy to pay it, because people who can split a price tend to buy more… and buy bigger.

Your friend Jay likes the sneakers. [mischievously] You like how easy that was.

[cheerful] That's level one. One plan. Totally under control."""),

("sec02", "Level 2", """[curious] Level two. Two plans.

Two weeks later, there's a jacket. A hundred and twenty dollars. Four payments of thirty.

[short pause] But here's the thing. The sneakers aren't paid off yet.

[thoughtful] This is the first quiet change, and it's the one nobody notices. You're not paying for A thing anymore. You're paying for a STACK of things, on different schedules, from different weeks of your life.

Fifteen here. Thirty there. Each one feels small on its own. That's how it's designed to feel. [cautiously] But on Friday, both come out of your account at the same time.

Let's actually do the math here, because nobody ever does.

Two plans means eight payments, spread over about two months, landing on four different days. Some weeks it's fifteen dollars. Some weeks it's forty-five. And you didn't choose any of those dates. They were picked for you, the second you tapped the button.

[serious] That's the quiet cost of buy now, pay later. It's not the interest. It's that your future paychecks are getting spoken for… one small slice at a time.

[light] You still feel fine. [short pause] Mostly."""),

("sec03", "Level 3", """[excited] Level three. Four plans.

Then it's the big holiday sale. And everything, EVERYTHING, has a pay in four button now.

[amused] You're not alone, by the way. In the twenty twenty-five holiday season, Americans spent twenty billion dollars online with buy now, pay later. And on Cyber Monday alone, it passed one billion dollars in a single day, for the first time ever.

Over eighty percent of that was on phones. Late at night, in bed, one thumb. [deadpan] Just like you.

[curious] And look at how that checkout is built. The pay later button is bigger than the pay now button. There's a countdown timer. "Only three left." The price in big letters is the small payment, and the real total is in tiny letters underneath.

[serious] None of that is an accident. Every part of it is designed to make the yes faster than the thinking.

And it works best on the people who can least afford it. The Fed's survey found that about sixteen percent of American adults used buy now, pay later in a year. But among households earning twenty-five to fifty thousand dollars, it was nearly one in four. Among households earning over a hundred thousand, it was only about one in eight.

[short pause] Four plans now. And you've stopped saying "I'm buying this." You've started saying "I'm only paying fifty this week."

[dramatically] That's the trick of the whole thing. The total disappears. All you ever see… is the next small payment."""),

("sec04", "Level 4", """[curious] Level four. Seven plans. Three apps.

At some point, you hit the limit on the first app. It just won't approve you for more.

[mischievously] So you download a second one. [short pause] And then a third.

This has a name. It's called loan stacking. And it's way more common than you'd think.

When the Consumer Financial Protection Bureau studied buy now, pay later loans, about sixty-three percent of borrowers had more than one loan going at the same time, at some point during the year. And a third had borrowed from more than one buy now, pay later company.

And getting approved again is easy. That same CFPB study found that in twenty twenty-two, these companies approved around seventy-eight percent of loan applications from people with subprime or deep subprime credit. The kind of credit that gets a lot of credit card applications turned down.

[sarcastic] Which sounds generous. [serious] But being approved and being able to afford it are two very different things.

And notice the sofa. That wasn't pay in four. That was a MONTHLY plan, a year long. Some of those longer plans charge interest, sometimes a lot of it. [dry] The "zero percent" in the ads doesn't always come along for the ride.

[tense] Now here's what makes stacking so dangerous. Every app only sees its OWN plans. App one doesn't know about app two. App two doesn't know about app three. And for a long time, most of this didn't show up on your credit report either.

Some people call it phantom debt. [slowly] It's real money you really owe… that nobody, including you, can see all in one place."""),

("sec05", "Level 5", """[quiet] Level five. Ten plans.

Then one week, the payments land before your paycheck does.

The sneakers, the jacket, the headphones, the chair, the TV, the sofa. They all want their slice. [short pause] And there's not enough left for food.

[softly] So you split your groceries.

[pause] [serious] Stop for a second, because this is the moment the whole thing changes.

Up to now, buy now, pay later was paying for things you WANTED. Now it's paying for things you NEED. Groceries don't sit in your closet. You eat them. And four weeks later, you're still paying for a meal you had last month… on top of the meals you need THIS month.

And this is not some rare thing. In the Federal Reserve's latest survey of American households, about one in five buy now, pay later users had used it for groceries or food delivery. And twenty-nine percent said they used it because it was the only way they could afford the purchase.

[short pause] [ominous] Remember this level. We're coming back to it."""),

("sec06", "Recap", """[upbeat] Quick catch-up.

Level one: one plan, totally fine.
Level two: the plans started overlapping.
Level three: the price tags disappeared.
Level four: three apps, and nobody can see the whole stack.
Level five: you split your groceries.

[thoughtful] So far, nothing has actually gone WRONG. You haven't missed a single payment.

[ominous] That's about to change."""),

("sec07", "Level 6", """[tense] Level six. The first late payment.

It's a Tuesday. Payday is Friday. And at six in the morning, three of your plans try to take their payments… from an account that has eleven dollars in it.

The problem is, your plans don't know when your payday is. Each one was set up on whatever day you happened to buy the thing. So on some weeks, everything lands BEFORE your money does.

[fast] Two things happen at once. The pay later app charges you a late fee. And your bank charges you an overdraft fee, because the payment went through anyway and pushed you below zero.

[serious] This is exactly where a lot of people end up. In that same Federal Reserve survey, about a quarter of buy now, pay later users had paid late in the past year. Of the people who paid late, sixty-four percent were charged a fee. And eleven percent of all users got hit with an overdraft or insufficient-funds fee because of a buy now, pay later payment.

[dry] And notice: the "zero percent" was only ever true if EVERYTHING went perfectly. Every payment, every week, for months. [sighs] Real life doesn't go perfectly."""),

("sec08", "Level 7", """[curious] Level seven. Your credit score finds out.

For years, the deal with a lot of these apps was: they don't really check your credit, and they don't really report to it.

[short pause] That's changing.

In twenty twenty-five, one of the biggest buy now, pay later companies started reporting ALL of its loans, including pay in four, to two of the three major credit bureaus. And FICO, the company behind most credit scores, announced new scores built to include buy now, pay later data.

[thoughtful] It's still patchy. Some companies report, some don't, and lenders don't all use the newest scores yet. But the direction is clear. Your pay later life is becoming visible.

[serious] And one thing has always been true. If a debt goes unpaid long enough to get sent to collections, that can show up and drag your credit score down. The kind of score that decides your rent applications, your car loan… sometimes even your phone contract.

And a lower credit score is expensive in ways you don't see straight away. It can mean a higher interest rate on a car loan, a bigger deposit on an apartment, or a no from a landlord before you've even had the chance to explain.

[sighs] Ten plans for sneakers and groceries… and now it's following you into the rest of your life."""),

("sec09", "Level 8", """[curious] Level eight. Paying debt with debt.

[mischievously] So you get creative.

[fast] Payment due on app one? Put it on your credit card. Groceries again? New plan on app three. Rent short this month? Borrow from Jay. Pay Jay back with… [short pause] another plan.

[serious] This is the moment the zero percent loan quietly becomes a VERY expensive one. Because the credit card you just used to cover a "free" payment? That one DOES charge interest. And a lot of it, every month you don't clear it.

[warmly] Remember lifestyle creep from the side hustle video? Each upgrade felt reasonable, until your life depended on money you didn't really have. [tense] This is the same trap, just faster. And with more apps."""),

("sec10", "Level 9", """[quiet] Level nine. Locked out.

And that brings us back to two in the morning.

[fast] Payment failed. Payment failed. Late fee.

[serious] Here's what usually happens next. Miss payments, and most apps stop letting you make new purchases. The thing that was always there to catch you… isn't anymore.

The plans you already have still need paying. The fees are still stacking. And if it goes on long enough, the debt can be handed to a collections agency. And THAT'S the version that's most likely to show up on your credit report.

[softly] And honestly, the worst part isn't even the money. It's the feeling. Flinching every time your phone buzzes. Not opening the banking app, because you don't want to know. Saying "yeah, all good"… when it's really not.

[pause] Twelve plans. Sixty-dollar sneakers. And a phone you're scared to look at.

[short pause] [hopeful] Okay. So how do we get out?"""),

("sec11", "Level 10", """[warmly] Level ten. Zero plans.

Deep breath. Here's how people actually climb out of this.

One: see the whole stack. Open every app and write down every plan. What's left, and when it's due. All of it, in one list. [encouraging] Phantom debt stops being scary the second you can see it.

Two: stop adding. Turn off one-tap checkout. Remove your saved cards from shopping sites. Delete the apps you don't need. Make the next plan HARDER to start than the last one.

Three: protect the essentials first. Rent, utilities, food. Then the plans, starting with whatever is late or charging fees or interest, because that's what's growing.

Four: talk to them. A lot of lenders have hardship options, or will move a payment date if you ask BEFORE you miss it. And if it's gotten really heavy, a nonprofit credit counselor can help you build a plan.

[curious] And there are two classic ways to pay the stack down. The avalanche: put every spare dollar on whatever's costing you the most in interest and fees, and pay the minimum on everything else. Or the snowball: kill the smallest plan first, for the quick win, then roll that money into the next one.

The avalanche usually saves more money. The snowball usually keeps people going. [warmly] The best one is whichever one you'll actually stick to.

[uplifting] And then, one by one, the plans close.

[short pause] [thoughtful] Buy now, pay later isn't evil. Used once, for something you planned to buy anyway, with the money already set aside? It's a free little loan. The problem was never one plan.

[firmly] It's the stack.

So if you ARE going to use it, here are the rules people who use it safely tend to follow.

Only use it if you could pay the full price today, from money you already have.

One plan at a time. Never a stack.

And never for the stuff you eat, the stuff you need to keep the lights on, or the stuff you'll be finished with before the last payment."""),

("sec12", "Payoff", """[curious] So. Which purchase was the point of no return?

Not the sneakers. One plan you can pay off is fine.

Not the TV or the sofa either. Those hurt, but they were still things you CHOSE.

[pause] [serious] It was the groceries.

The moment buy now, pay later stopped paying for things you WANTED, and started paying for things you NEEDED. Because you can always stop buying sneakers. [short pause] You can't stop eating. From that moment on, every week made the next week worse.

[warmly] If you ever catch yourself splitting groceries, that's not a shortcut anymore. That's the warning light.

[playful] So be honest with me. How many buy now, pay later plans do you have open right now? Zero counts. Tell me in the comments. I read all of them.

[upbeat] And if you want to see what happens when you're on the OTHER side of the money, here's your life at every level of side hustle, from zero to a million."""),
]

KEEP = {'US', 'OK', 'TV', 'CFPB', 'FICO', 'APR', 'BNPL'}
def clean(t):
    t = re.sub(r'\[[^\]]*\]\s*', '', t)
    t = re.sub(r"\b([A-Z][A-Z']+)\b", lambda m: m.group(1) if m.group(1) in KEEP else m.group(1).lower(), t)
    t = re.sub(r'(^|[.?!]\s+|\n\s*|"\s*)([a-z])', lambda m: m.group(1) + m.group(2).upper(), t)
    return re.sub(r'[ \t]+', ' ', t).strip()

if __name__ == '__main__':
    tot = 0; os.makedirs('vo', exist_ok=True)
    for k, name, t in SECS:
        c = clean(t); w = len(c.split()); tot += w
        open(f'vo/{k}.txt', 'w').write(c)
        print(k, name, w, 'words', len(t), 'chars')
    print('total words', tot, '≈', round(tot / 175, 1), 'min of VO')
