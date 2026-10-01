# V04 narration v3: tagged for eleven_v4. Tags in [brackets] are performance cues, not spoken.
# clean(text) strips them for captions / alignment.
import re
SECS = [
# 00 HOOK (cold open flash-forward)
("sec00", "Hook", """[dramatically] It's two in the morning. Your kitchen is full of boxes. Your phone has four hundred unread messages. [nervous] And there's a man from the tax office standing at your door.

[short pause] [curious] Six months ago? All you had was a job… and an idea.

[warmly] Let's rewind.

You have a job. It pays the bills… [sarcastic] mostly. And like almost everyone with a job, you have an idea. Something you could sell. Something you could do on the side.

[excited] By the end of this video, that idea is going to make you a MILLION dollars.

[pause] [dramatically] But somewhere between zero and a million, almost everyone quits. Not because they fail. Not because the idea was bad. [sighs] Because of something way more boring than that.

[curious] So here's the question: which level kills the most side hustles? It's not the one you think. [mischievously] And the most important level isn't the one you'd guess either.

[excited] Clock's out. Let's go."""),

# 01 LEVEL 1
("sec01", "Level 1", """[curious] Level one. Zero dollars.

At zero dollars, a side hustle is mostly… [chuckles] watching videos about side hustles.

Everyone online is making money while they sleep. [sarcastic] You're not making money while you're awake.

[cautiously] And this is where the first trap lives. At level zero, the easiest person to make money from… is YOU. Courses. Templates. "Secret" strategies. At level zero, you're not the business. You're the customer.

Then comes trap number two: pretending to work. You spend three weeks designing a logo, picking a name and building a website… [sighs] for a business with exactly zero customers. It FEELS productive. It isn't.

[warmly] The side hustles that actually get going usually start with something you already have. A skill people pay for at work. A tool in your garage. The thing your friends keep asking you to help with for free. Not the hottest hustle on the internet. The one you could start THIS weekend.

And you can test it this weekend too. Before you build anything, tell ten people what you're offering and what it costs. If nobody bites, you've lost a weekend, not a year. If somebody does… you've got your first customer before you've even finished the logo.

[excited] So here's the only move that matters at level one: stop researching, and sell one thing. Anything."""),

# 02 LEVEL 2
("sec02", "Level 2", """[whispers] Level two. One dollar.

[short pause] Then one night… it happens.

[surprised] A complete stranger, someone who owes you absolutely nothing, gives you money for something you made.

[chuckles] After the platform takes its cut, it's maybe a dollar of actual profit. [excited] It feels like a MILLION.

And you're in good company. In Bankrate's 2025 survey, twenty-eight percent of people with a side hustle made between one and fifty dollars a month.

[warmly] So yes, it's small. But the feeling you have right now is the most important thing in this entire video. Because it proves the one thing no course and no business plan can prove: a real person will pay you.

[mischievously] Most ideas never get here. Yours just did. Remember this level. We're coming back to it."""),

# 03 LEVEL 3
("sec03", "Level 3", """[curious] Level three. A few months in.

Quick question before I tell you. How much do you think the TYPICAL side hustler makes a month? Two hundred dollars? Nine hundred? Two thousand? [short pause] Lock in your answer.

[pause] It's two hundred.

In Bankrate's 2025 survey, about one in four American adults had a side hustle. For Gen Z it was one in three. And the median side hustler made two hundred dollars a month. [surprised] But the AVERAGE was eight hundred and eighty-five.

When the average is more than four times the median, it means a small group of people is making a LOT… [sarcastic] and everybody else is making lunch money.

And lunch money matters. Thirty-five percent of side hustlers said they use it for regular living expenses. Not holidays. Rent. Groceries. Bills.

[cautiously] Now here's the math nobody posts online. Take what you made, and divide it by the hours you actually put in. Made-up example: two hundred dollars for twenty hours is… ten dollars an hour.

[sighs] Congratulations. You've invented a part-time job. No boss… but also no guaranteed pay, no sick days, and nobody to complain to.

[curious] And that's because of WHAT KIND of hustle you picked. There are really only three.

One: you sell your time. Tutoring, freelancing, driving, fixing things. It pays from day one, but you can only earn as many hours as you have.

Two: you sell stuff. You make or buy things and sell them for more. More room to grow, but now you've got stock, shipping and returns.

Three: you sell something you make ONCE. A template, a course, an app. It can sell a thousand times without a thousand times the work. [cautiously] But it's the slowest to take off, and most never do.

Most people start with type one, because it's the fastest way to a first dollar. [mischievously] Remember that clock. It's about to become a problem."""),

# 04 LEVEL 4
("sec04", "Level 4", """[nervous] Level four. Four hundred dollars. [short pause] And someone new has noticed you.

[sarcastic] Congratulations. You've attracted your first follower.

In the US, once your net earnings from self-employment hit four hundred dollars in a year, you generally have to file and pay self-employment tax. That's fifteen point three percent, for Social Security and Medicare, on top of regular income tax.

At your day job, you never noticed this, because your employer quietly paid half of it for you. [chuckles] Now YOU'RE the employer. So you pay both halves.

[warmly] The good news? The key word is NET. That's what's left after real business expenses. Supplies, software, shipping, the part of your phone bill you actually use for the business.

So from this level on, you keep every single receipt. And a lot of people start moving a slice of every sale into a separate pot for tax, so April isn't a jump scare.

[mischievously] Your hobby has a tax bill now. That's how you know it's real."""),

# 05 LEVEL 5
("sec05", "Level 5", """[curious] Level five. Ten thousand dollars a year.

That's real money. For a lot of people, that's a holiday, a car repair fund and an emergency fund, all at once.

[tired] It's also a second job.

Evenings: gone. Weekends: gone. Your friends: [sarcastic] "Are you… still alive?"

[slowly] Think about the hours. A week has one hundred and sixty-eight of them. Take off sleep. Take off your day job. Take off commuting, eating, showering and just… existing. What's left is maybe a few hours a day. [sighs] And now your hustle wants all of them.

[dramatically] And here's the cruel part. At your day job, when you work harder, you get tired. At your side hustle, when you work harder, you get tired AND you get more orders. Success makes the problem WORSE.

[softly] This is the time wall. It's where a huge number of side hustles quietly die. The idea wasn't bad. The customers were real. The hustler just… ran out of hours.

[excited] The people who break through usually do three things.

One: they raise their prices. It feels terrifying. But if you're fully booked, you're probably too cheap.

Two: they drop the customers who take the most time for the least money. [chuckles] Every hustle has a few. You know exactly who they are.

Three: they automate or outsource the boring stuff. Templates, scheduling tools, a freelancer for the jobs they hate.

[warmly] At level five, the whole game changes. You stop selling your TIME… and start building a SYSTEM."""),

# 06 LEVEL 6
("sec06", "Level 6", """[nervous] Level six. Twenty thousand dollars. [short pause] Something arrives in the mail.

Once you pass twenty thousand dollars in payments AND two hundred transactions through a payment platform in a year, that platform will usually send you, and the IRS, a form called a ten ninety-nine K.

[cautiously] To be clear, the IRS already expected you to report ALL of your income, form or no form. Now there's just a paper trail.

[warmly] This is the level where the hobby grows up. You open a separate business bank account, so business money and pizza money stop mixing. You start paying estimated taxes during the year, instead of one horrible surprise in April. And plenty of people set up an LLC around here.

[curious] Quick reality check on the LLC, though. It's a legal wrapper, not a magic tax trick. It doesn't make your taxes disappear. What it mostly does is draw a line between "the business" and "you". And that matters a lot once real money is involved.

[mischievously] You're not doing "a little thing on the side" anymore. You're running a business. Time to start acting like it."""),

# 07 RECAP + GUESS
("sec07", "Recap", """[excited] Quick catch-up.

Level one: you stopped buying courses. Level two: a stranger paid you. Level three: you realized you were earning about ten bucks an hour. Level four: the taxman showed up. Level five: you hit the time wall, and built a system. Level six: the paperwork arrived.

[mischievously] Now, before we go on… which level do you think kills the most side hustles? Put your guess in the comments right now. We'll find out who was right at the end.

[curious] Because from here, the problems stop being about money… [dramatically] and start being about PEOPLE. Starting with the one in the mirror."""),

# 08 LEVEL 7
("sec08", "Level 7", """[excited] Level seven. Three thousand dollars a month. On the side.

[mischievously] So naturally… you reward yourself.

Newer car. Better phone. Nicer apartment. More takeout, because who has time to cook when you're running an empire?

[pause] [nervous] And then one day, you notice something scary. Your side hustle isn't EXTRA money anymore. It's holding up your whole life.

This is lifestyle creep. And it's sneaky, because every single upgrade felt reasonable. [sighs] But now you CAN'T have a slow month. You CAN'T take a break. The hustle owns you.

[warmly] The people who avoid it treat hustle money as a different kind of money. It goes into the business, into savings, into paying off debt. Anything except quietly raising the cost of normal life.

[cautiously] Because in two levels, you're going to want the freedom to make a very big decision. And lifestyle creep is how people lose that freedom… without even noticing."""),

# 09 LEVEL 8
("sec09", "Level 8", """[curious] Level eight. Fifty thousand dollars a year. People have noticed you.

[sarcastic] Unfortunately… some of those people are competitors.

The moment something makes money in public, someone copies it. Same product. Same photos. Sometimes the exact same words in the description. [surprised] And a lower price.

[nervous] This is where a lot of people panic and start a price war. Prices go down, and down, and down. It's a race to the bottom… and the winner is whoever can survive earning the least.

[warmly] The hustles that make it through do something else. They build the one thing a copycat can't copy: a reason to pick YOU. Reviews. Repeat customers. Fast replies. A handwritten thank-you in the box. People who know your name and tell their friends.

That's called a brand. Right now, it's the most valuable thing you own… and it doesn't show up anywhere on the level bar.

[dramatically] Which is good timing. Because the next level is the one that changes your whole life."""),

# 10 LEVEL 9
("sec10", "Level 9", """[dramatically] Level nine. One hundred thousand dollars a year. Your side hustle now makes as much as your job. Maybe more.

[pause] And you face the biggest decision in this entire video.

[slowly] Do you quit?

[excited] It's SO tempting. No boss. No commute. [chuckles] No meetings that should've been emails.

[cautiously] But your job gives you things that don't show up on your paycheck. A steady income, even in a bad month. Paid time off. In the US, usually health insurance. Often a retirement plan with an employer match. Quit, and you have to replace all of that yourself.

So a common approach is to build a runway first. Made-up example: save enough to cover six to twelve months of living costs. Watch the hustle keep hitting its numbers. THEN jump. [sarcastic] Because your hustle might have a bad month. Your rent won't.

[warmly] And this is exactly why level seven mattered. If lifestyle creep ate the hustle money, there's no runway. If you saved it, there is.

It doesn't have to be all or nothing, either. Some people go part-time first. Some switch to four days a week. Some keep the job and hire help for the hustle instead. There's no right answer. Just the one that matches your runway… and your nerve.

[pause] [excited] You jump."""),

# 11 LEVEL 10
("sec11", "Level 10", """[excited] Level ten. Half a million dollars a year. You've hired people.

[mischievously] And here's the plot twist nobody warns you about. The thing you loved doing? [sighs] You barely do it anymore.

Your job now is payroll. Hiring. Training. Managing. And fixing whatever broke today. [chuckles] You started a business so you'd never have a boss… and now you ARE one.

[curious] So who do you hire first? A lot of owners say the same thing: hire for the job you're WORST at, or the one you hate most. Great at making the product but awful at emails? Your first hire answers the emails. Every hour you spend on the thing you're bad at is an hour you're not spending on the thing only you can do.

[dramatically] And this is where you learn the most important lesson in business. Revenue… is not profit.

Made-up example: five hundred thousand dollars comes in. Staff, stock, software, rent and taxes take three hundred and fifty thousand of it. What's actually YOURS is a hundred and fifty.

[warmly] Still a great result. But it's not what the level bar says. [mischievously] So next time someone online says "my business made half a million this year"… ask them one question. Made? [short pause] Or KEPT?"""),

# 12 LEVEL 11
("sec12", "Level 11", """[dramatically] Level eleven. [pause] One. Million. Dollars.

[curious] Here's what most "I built a million-dollar side hustle" stories leave out. That million is usually REVENUE. A million coming in. Not a million in your pocket.

So how does a side hustle actually make someone a millionaire? [short pause] Often… by selling it.

[surprised] A buyer walks in with a briefcase.

Buyers don't pay for one year of profit. They pay for a business that will KEEP making profit, ideally without you in it. That's why the system from level five and the brand from level eight suddenly matter so much. They're what make the business sellable.

Made-up example: if a buyer paid three times a yearly profit of three hundred thousand dollars, that's nine hundred thousand dollars… for something that started on your kitchen table. [cautiously] Real prices vary a LOT from business to business.

[nervous] But before they pay a cent, they go through everything. Are the profits real, and can you prove them? [chuckles] Remember those receipts from level four? This is where they pay off. Do customers come back? And would the whole thing collapse if YOU disappeared for a month?

[dramatically] If the answer to that last one is yes, you don't own a business. You own a job with extra paperwork. And nobody pays much for that.

[warmly] Remember our very first video? The richest people in the world don't just own yachts. They own boring businesses that make money whether they show up or not. [excited] Your side hustle just became one of those.

[short pause] [curious] Oh, and that man from the tax office at the start of the video? That was level four. [chuckles] Spoiler: he never really leaves."""),

# 13 PAYOFF
("sec13", "Payoff", """[curious] So. Which level kills the most side hustles?

Not level one. At zero, you haven't really started. Not the million. By then, you've basically won.

[dramatically] It's the time wall. Level five. Somewhere between a few hundred and a few thousand dollars a month, when it stops being exciting… and starts eating every evening you've got. That's where most people stop. Not because the idea was bad, but because they never turned their TIME into a SYSTEM.

[cautiously] And the sneakiest killer is lifestyle creep. Because it doesn't feel like failing. It feels like winning.

[warmly] But the most IMPORTANT level? [pause] It's the one dollar. Because once one stranger pays you, you know it's possible. Everything after that is just doing it again… bigger… and smarter.

[excited] So, did you guess right? And what's YOUR side hustle? Tell me which level you're on in the comments. I read all of them.

And if you want to see what happens when the money REALLY stacks up… here's every level of wealth, all the way to a hundred billion dollars."""),
]

def clean(t):
    t = re.sub(r'\[[^\]]*\]\s*', '', t)
    t = re.sub(r"\b([A-Z][A-Z']+)\b", lambda m: m.group(1) if m.group(1) in ('IRS','US','LLC','OK') else m.group(1).lower(), t)
    t = re.sub(r'(^|[.?!]\s+|\n\s*|"\s*)([a-z])', lambda m: m.group(1)+m.group(2).upper(), t)
    return re.sub(r'[ \t]+', ' ', t).strip()

if __name__ == '__main__':
    tot = 0
    for k, name, t in SECS:
        w = len(clean(t).split()); tot += w; print(k, name, w, len(t))
    print('total words', tot, 'est VO min at 172 wpm', round(tot/172, 1))
