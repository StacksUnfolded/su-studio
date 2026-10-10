# V07 narration, tagged for eleven_v4. Tags in [brackets] are performance cues and are not spoken.
# No ALL-CAPS emphasis (it leaks into captions). Use tags for delivery instead. Numbers are spelled out.
import re, sys, os
SECS = [
("sec00", "Cold open", """[quiet, tense] Day one thousand, eight hundred and twenty-six.

Exactly five years ago tonight, you won ten million dollars.

[short pause] And right now, your banking app is open… [nervous] and you're scared to look at it.

[matter-of-fact] Two states away, the only other person who won that night is checking his.

You both started with the same ticket. The same jackpot. The same five years.

[short pause] [serious] One of you is still rich. One of you isn't.

[building] The difference comes down to seven rules. Not luck. Not a genius investment. Seven boring rules, and one study about lottery winners that should scare anyone who ever gets a windfall.

[warmly] So let's go back to day zero. And this time, you get to watch every decision."""),

("sec01", "Day 0: The ticket", """[casual] Day zero. It's a Wednesday. You bought the ticket on the way home, because the jackpot hit twenty million dollars and everyone at work was talking about it.

[slowly, building tension] First number. Match. Second. Match.

[short pause] Third. Fourth. Fifth.

[short pause] [whispering] The last ball.

[excited] Match!

[matter-of-fact] Two tickets matched that night. The twenty million is split down the middle. Your half: ten million dollars.

[thoughtful] And here's the first moment that decides how this ends. You want to call your mom. Your best friend. Your group chat. Your boss, so you can quit.

[short pause] [calm] You don't call anyone.

Because the second people know, your life stops being yours. You haven't got a plan yet, so for now, the only plan is silence.

[deadpan] Meanwhile, Dez posts a video of his ticket. With the numbers showing.

[firm] Rule number one: say nothing until you have a plan."""),

("sec02", "Day 1: The real number", """[curious] Day one. The next morning, you do something most winners skip. You work out how much you actually won.

That ten million on the billboard? It isn't a pile of cash. It's the annuity number. One payment now, then twenty-nine more payments, one a year, each five percent bigger than the last.

[matter-of-fact] Or you can take the cash option: one payment, today. And that's usually a lot less than half. When one jackpot was advertised at five hundred and sixty-five million dollars, the cash option was about two hundred and fifty-five million. Roughly forty-five percent.

So you take the cash. [short pause] Ten million becomes four and a half.

Then, before you ever see a cent, the lottery holds back twenty-four percent for federal tax. That's the rule for big gambling wins.

That's another million gone. Three point four million lands in your account.

[short pause] [knowingly] But that twenty-four percent is just a down payment. A win this big puts you in the top tax bracket, thirty-seven percent, so next April you'll owe roughly another half a million dollars.

And that's in a state with no income tax. In many states, there's a state bill on top.

[serious] Your ten million dollars is about two point nine million.

[warmly] Still life-changing. But it's not ten. And every bad decision winners make starts with spending like the big number is real.

[calm] So the first thing you buy with your winnings is… nothing. You move the April tax money into its own account, where you can't see it every day.

[deadpan] Dez is still spending from the ten million in his head.

[firm] Rule number two: your real number is the one after tax."""),

("sec03", "Week 1: The team", """[matter-of-fact] Week one. You still haven't claimed the prize. Most lotteries give you months, not days, so there's time to do it properly.

First, you hire three people: a fee-only financial planner, who's paid by you and not by commissions on what they sell you; a tax accountant; and a lawyer.

You interview several of each. You ask how they get paid. [knowingly] And you notice which ones get excited about your money, and which ones get excited about a plan.

[curious] Then the lawyer tells you something you didn't know. In about a dozen states, jackpot winners can stay completely anonymous. In others, your name and your town can become public record, and some states only offer privacy above a certain prize size.

[calm] You live in a state where you can claim quietly, so you do.

[deadpan] Dez does a press conference with a giant check.

[amused] By Friday, he has two thousand new friend requests.

[firm] Rule number three: build the team before you spend a dollar."""),

("sec04", "Month 1: Everyone you've ever met", """[wryly] Month one. You did stay quiet. But people find out. They always do.

And suddenly, everyone you've ever met needs something. A cousin has a business idea. An old friend's car broke down. A guy from high school wants to catch up over coffee. Your phone lights up with numbers you don't know.

[serious] And here's the trap: every single request is small compared to millions. Ten thousand here, fifty thousand there. Saying yes feels easy.

[short pause] Fifty yeses later, a million dollars is gone.

[calm] So you make one decision, once, in writing. Ten percent of your real number goes to family and friends. You decide exactly who gets what: your parents' mortgage, a college fund for your nephew, something for your best friend.

[matter-of-fact] And you learn a tax rule. In twenty twenty-six, you can give anyone up to nineteen thousand dollars a year without even filing a form. Bigger gifts need a gift tax return, but you won't actually owe gift tax unless your lifetime gifts go past fifteen million dollars.

When the list is done, it's done. Anyone new gets the same answer: "All of that goes through my planner now."

[deadpan] Dez says yes to everyone. The line at his door is getting longer.

[firm] Rule number four: decide who gets what once, in writing."""),

("sec05", "Month 3: The house", """[playful] Month three. Of course, you want a house. Everyone does.

The agent shows you a mansion. Four million dollars. You could almost afford it… if you didn't need the money for anything else.

[knowingly] But a house isn't one price. It's a monthly bill that never stops. Property tax, insurance, repairs, a roof that needs replacing, a pool that needs cleaning. The bigger the house, the bigger the bill, every month, forever.

[warmly] So you buy a nice, normal house for six hundred thousand dollars, in cash. No mortgage.

The upkeep is about twelve hundred and fifty dollars a month. You can carry that for the rest of your life without thinking about it.

[deadpan] Dez buys the mansion. And a boat. [short pause] And a second boat, for the first boat.

[firm] Rule number five: every purchase comes with a monthly bill."""),

("sec06", "Month 6: The job", """[matter-of-fact] Month six. You still go to work. And everyone thinks you're weird for it.

Here's why. After the gifts and the house, just under two million dollars is left to invest. That sounds like you never have to work again.

[thoughtful] But remember the old money rule: eat the fruit, never the tree. A pile like this might pay out somewhere around three to four percent a year without shrinking, if things go well.

That's about seventy thousand dollars a year.

[warmly] That's a great life. It's just not a "never think about money again" life. So you switch to part-time, take a pay cut, and let the pile do some of the work.

[amused] Dez quit his job on day two. In a video. He called his boss a clown.

[firm] Rule number six: your new salary is what the pile pays you, not the pile."""),

("sec07", "Quick catch-up", """[brisk] Quick catch-up. You told no one. You worked out the real number and hid the tax money. You built a team, made one giving list, bought a house you can afford forever, and kept your job.

Dez has done the exact opposite of all six. [chuckles] And so far, honestly? He's having a lot more fun than you are.

[short pause] [ominous] But it's about to be April."""),

("sec08", "Year 1: April", """[matter-of-fact] Year one. Tax season. Remember that half a million dollars? Your accountant files, you pay from the account you set up on day one, and you go home for dinner.

[relaxed] Total stress: about ten minutes.

[short pause] [serious] Dez gets the same bill.

But his money is in the boat. And the cars. And in loans to forty-one people he'll never see again.

He sells one of the cars at a loss to pay it. Then the second boat. [deadpan] He's still short."""),

("sec09", "Year 2: The opportunity", """[warmly] Year two. Your friend Marco wants to open a restaurant. He's good. He's passionate. He needs two hundred thousand dollars.

[sighs] And you really want to say yes.

[thoughtful] But back in week one, your planner made you set up a fun-money bucket: five percent of the winnings. That's the money for risky ideas, toys, and friends' dreams. When it's empty, it's empty.

So you offer Marco fifty thousand from the bucket. Not two hundred.

[short pause] [sympathetic] Eighteen months later, the restaurant closes. You're sad for Marco. But you're not ruined.

[deadpan] Dez puts a million dollars into a can't-lose crypto fund, run by a guy he met at a car show.

[dryly] You can guess how that goes.

[firm] Rule number seven: only bet money you've already said goodbye to."""),

("sec10", "Year 3: The danger zone", """[curious] Year three. Now, you've probably heard that seventy percent of lottery winners go broke. It's everywhere online.

[matter-of-fact] But the organization that statistic is usually pinned on says it isn't their research, and they can't confirm it.

[short pause] [serious] There's a real study, though. And it's scarier.

Researchers followed about thirty-five thousand lottery winners in Florida. They compared people who won fifty to a hundred and fifty thousand dollars with people who won less than ten thousand.

Right after winning, the bigger winners were less likely to go bankrupt. Makes sense: they had cash.

[ominous] But three to five years later, the advantage was gone. The money had mostly delayed bankruptcy instead of preventing it. The bigger winners didn't use the win to pay off their debts or build up savings.

[thoughtful] To be fair, those were much smaller wins than yours. But the pattern is the point: a windfall doesn't fix money habits. It just gives them more fuel.

[quiet] And year three is when you feel it too. The excitement's gone. You're a bit bored. You start to wonder why you're living like a normal person when you have millions.

[short pause] [calm] You don't buy the watch. You don't buy the bigger house. That's the hardest decision of the whole five years, and nobody will ever congratulate you for it."""),

("sec11", "Year 4: Dez", """[sympathetic] Year four. Let's check in on Dez.

He's sold the mansion. He's selling the last car. Most of the people who lined up at his door don't answer his calls anymore. [deadpan] And the crypto guy's website doesn't exist.

[serious] He didn't do one big crazy thing. He did dozens of medium ones, in the first year, all spending from the ten million that was never really there.

[gently] He's not a villain. He's what happens when anyone gets a lot of money with no rules around it."""),

("sec12", "Day 1,826: The app", """[quiet] So here we are. Day one thousand, eight hundred and twenty-six. Five years to the day.

You flip your phone over and open the app.

[short pause] [relieved] Two point one million dollars invested. A house with no mortgage. And a job you actually like, three days a week.

You still have more invested than you did in month six, even after five years of taking money out.

[warmly] Five years ago, you won ten million dollars. And honestly? The ten million was never the prize. The prize is that you'll never have to worry about money again, as long as you keep the rules."""),

("sec13", "Payoff", """[confident] So here are the seven rules that kept you rich.

One: say nothing until you have a plan.
Two: your real number is the one after tax.
Three: build the team before you spend a dollar.
Four: decide who gets what once, in writing.
Five: every purchase comes with a monthly bill.
Six: your new salary is what the pile pays you.
Seven: only bet money you've already said goodbye to.

[warmly] And here's the thing. You don't need to win the lottery to use three of these.

Your next raise, your tax refund, a bonus, an inheritance: work out the real number after tax before you spend a cent of it. Every time you buy something, ask what it costs every month, not just today. And if you want to take a risk, decide how much you're willing to lose before you start.

[amused] Oh, and Dez? He's fine. He's got a job again. He came to your barbecue last week.

[short pause] [deadpan] He brought a lottery ticket.

[cheerful] So, be honest. If you won ten million dollars tonight, what's the first thing you'd buy? Tell me in the comments.

[warmly] And if you want to see how families stay rich for a hundred years instead of five, watch this one next."""),
]

SHORTS = [
("shortA", "Short A: $10M is really $2.9M", """[excited] You just won ten million dollars. [short pause] [deadpan] Congratulations. Now watch it shrink.

[matter-of-fact] That ten million is paid over thirty years. Take the cash instead, and it's about forty-five percent: four and a half million.

The lottery holds back twenty-four percent for federal tax. Three point four.

Then next April, the top bracket wants roughly another half a million. [short pause] That's about two point nine million. In a state with no income tax.

[knowingly] So the next time someone tells you…"""),
("shortB", "Short B: 70% go broke?", """[curious] Seventy percent of lottery winners go broke. You've heard that, right?

[matter-of-fact] The group it's usually credited to says it isn't their research, and they can't confirm it.

[serious] But here's the real study. About thirty-five thousand Florida lottery winners. People who won up to a hundred and fifty thousand dollars avoided bankruptcy at first. Three to five years later? The money had mostly just delayed it.

[knowingly] Because a windfall doesn't fix money habits. It just feeds them. [short pause] And that's why…"""),
]

KEEP = {'US', 'OK', 'TV'}
def clean(t):
    t = re.sub(r'\[[^\]]*\]\s*', '', t)
    t = re.sub(r"\b([A-Z][A-Z']+)\b", lambda m: m.group(1) if m.group(1) in KEEP else m.group(1).lower(), t)
    t = re.sub(r'(^|[.?!]\s+|\n\s*|"\s*)([a-z])', lambda m: m.group(1) + m.group(2).upper(), t)
    return re.sub(r'[ \t]+', ' ', t).strip()

if __name__ == '__main__':
    tot = 0; os.makedirs('vo', exist_ok=True); os.makedirs('shorts', exist_ok=True)
    for k, name, t in SECS:
        c = clean(t); w = len(c.split()); tot += w
        open(f'vo/{k}.txt', 'w').write(c)
        print(k, name, w, 'words', len(t), 'chars')
    for k, name, t in SHORTS:
        c = clean(t); open(f'shorts/{k}.txt', 'w').write(c); print(k, name, len(c.split()), 'words')
    print('total words', tot, '≈', round(tot / 175, 1), 'min of VO')
