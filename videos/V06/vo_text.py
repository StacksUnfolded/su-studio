# V06 narration, tagged for eleven_v4. Tags in [brackets] are performance cues and are not spoken.
# No ALL-CAPS emphasis (it leaks into captions). Use tags for delivery instead.
import re, sys, os
SECS = [
("sec00", "Cold open", """[excited] Your last video got two million views. A hundred and forty thousand likes. Strangers know your name. Brands are in your DMs every single day.

[short pause] [deadpan] And your bank account says… two hundred and twelve dollars.

[matter-of-fact] That's not a glitch. That's the most common way to be an influencer.

[curious] So today, we're starting you at zero followers and taking you all the way to ten million. At every level, you'll see exactly where the money comes from, and how much of it you actually keep.

[mysteriously] And somewhere on this ladder is the level where an influencer actually starts making a living. [short pause] It's not the follower count you think it is. [warmly] Let's find it."""),

("sec01", "Level 0", """[curious] Level zero. You've got a phone, a free app, and zero followers.

And before you've made a single cent, you've already spent ninety-five dollars on a ring light, a tripod and a tiny microphone.

You post every day for a month. Your best video gets two hundred and thirty views. [chuckles] Most of them are your mom.

[thoughtful] Here's the first thing nobody tells you. At level zero, the platform is making money off you. Every video you post keeps people scrolling, and every scroll is an ad they can sell. [deadpan] You're working for free.

And you're not alone. Millions of people are doing the exact same thing tonight, in the exact same bedroom lighting, hoping the same app picks them.

[sympathetic] Most of them quit right here. Not because they're bad, but because forty hours of work for two hundred views feels like shouting into a pillow.

[building] But you don't quit. And on day thirty-three, one video hits.

[excited] Four hundred and eighty thousand views. Overnight. Your follower count jumps from forty-seven to a thousand and twelve."""),

("sec02", "Level 1", """[cheerful] Level one. A thousand followers. And your first brand DM.

[playful] "We love your vibe. Can we send you a free hoodie? Just tag us."

[excited] Free stuff! You made it!

[short pause] [serious] Except that hoodie comes with two strings attached.

String one: the Federal Trade Commission says that if a brand gives you anything of value, even a free product, and you post about it, you have to clearly disclose it. Not hidden in your bio. Not behind "more". Right there in the post.

String two: in the U.S., stuff you get in exchange for promotion is generally treated as income, at what it would cost to buy. [wryly] So that "free" hoodie might show up on your tax bill.

[curious] And there's a sneakier catch. Read the small print in that DM, and they want you to make a video, tag them, and let them use your video in their own ads.

So a company gets a professional-looking ad, made by you, starring you… [deadpan] for the price of one hoodie. In the industry, that's called content usage rights, and later in your career, brands will pay extra for it. Right now, you're giving it away.

[wryly] At level one, you're not being paid. You're being paid in hoodies. And you can't pay rent in hoodies."""),

("sec03", "Level 2", """[upbeat] Level two. Ten thousand followers. And this time, the DM has a number in it.

Brands call this tier "nano" or "micro," and typical rates run from about a hundred to a few hundred dollars a post.

You charge two hundred and fifty. [short pause] They say yes instantly.

[knowingly] And that's your first lesson in negotiation: if a brand says yes in four seconds, you probably asked for too little. Next time, you make a one-page rate card, with your audience, your average views and your prices, like an actual business.

[warning] Oh, and watch out for the other kind of DM that shows up at this level. [mocking] "Congrats, you've been selected as a brand ambassador! Just pay forty-nine dollars for your starter kit." [firm] A real brand pays you. If a "brand" wants you to pay first, it's not a deal. It's a scam.

[warmly] Still, the GlowSip money is the first real money you've ever made from your phone.

[curious] Then you discover affiliate links. You get a cut every time someone buys through your link.

Somebody buys a forty-dollar water bottle through your link. Your commission is… [deadpan] a dollar twenty.

[matter-of-fact] Affiliate money is real, but at this size it's coffee money. To live off a dollar twenty, you'd need thousands of sales a month.

[building] So you go after the thing everybody wants: getting paid by the platform itself."""),

("sec04", "Level 3", """[curious] Level three. You hit the platform's payout bar.

On YouTube, the full partner program needs a thousand subscribers, plus either four thousand watch hours in a year or ten million Shorts views in ninety days.

[matter-of-fact] Then come the cuts. On regular videos, you keep fifty-five percent of the ad revenue. On Shorts, you keep forty-five percent of your share of the Shorts pool. The platform keeps the rest.

[short pause] Your first month of ad money: [deadpan] thirty-seven dollars and twelve cents.

[thoughtful] And the amount you get per view isn't fixed. Advertisers pay way more to show ads next to some topics than others. A video about investing or software can earn several times more per view than a video of you trying weird snacks, because the advertisers behind it are chasing customers worth more money.

Same views, totally different paycheck. [chuckles] That's why so many creators suddenly start making videos about money.

[serious] And here's the part that hurts: ad money is paid per view, not per follower. You can have a hundred thousand followers, but if this month's videos flop, this month's check flops with them.

[tired] So you do what every creator does. You post more."""),

("sec05", "Level 4", """[tired] Level four. Fifty thousand followers. On paper, you're growing. In real life, you're exhausted.

You film in the morning, edit at night and reply to comments in between. You're posting every day, because the moment you stop, the algorithm stops showing you to people.

[wistful] And everywhere you look, someone else is doing better. Their numbers are bigger, their videos are cleaner, their apartment has a neon sign. So you buy a better camera. Then better lights. Then a second phone just for filming.

[short pause] [tense] Then one week, your views get cut in half. No warning. No email. No reason.

[serious] Your income gets cut in half too. Because when your whole business is one app's algorithm, you don't really own a business. You're renting one.

[mysteriously] Remember that line. It comes back at level eight."""),

("sec06", "Catch-up", """[upbeat] Quick catch-up. At zero, you pay to play. At a thousand, you're paid in free stuff. At ten thousand, your first real check. Then the platform pays you a little, and the algorithm can take it away anytime.

[mischievously] And now you're about to get famous. Which is where it gets weird."""),

("sec07", "Level 5", """[excited] Level five. A hundred thousand followers. People recognize you at the grocery store.

And the deals jump. Brands pay this tier thousands of dollars a post.

Four thousand dollars for one minute of talking about an energy drink. [laughs] You feel rich.

[serious] But deals don't come every month. One month it's four thousand dollars, the next month it's zero. And brands often pay thirty, sixty, even ninety days after you post.

[thoughtful] And now there's a new pressure. Your audience expects you to look successful. The content that grows fastest at this level is the content that looks expensive: nice apartment, nice car, nice trips.

[wryly] So you rent the car for the shoot. You film the "day in my life" in a hotel lobby. You spend real money to look like you have money, because looking rich is what brings the next deal.

[serious] This is why so many influencers look rich and aren't. A big survey of over five thousand creators this year found that sixty-seven percent earn less than ten thousand dollars a year, and just under five percent make more than a hundred thousand.

[knowingly] And when your income looks like a heartbeat monitor, it's really easy to start "pay in four"-ing your life. We did a whole video on how that ends."""),

("sec08", "Level 6", """[matter-of-fact] Level six. You can't do it all alone anymore. So you build a team.

A manager who finds you deals and takes a cut. An editor so you can sleep. [chuckles] An accountant, because now there's a lot more to count.

[serious] And then there's the cut nobody budgets for. In the U.S., when you work for yourself, you pay self-employment tax: fifteen point three percent on your profit, on top of regular income tax. There's no boss taking it out of your paycheck. You owe it yourself.

So that eight-thousand-dollar deal? After everybody's cut, you might keep a little over half.

[curious] And then you read the contracts properly for the first time.

"Net sixty" means they'll pay you sixty days after you post. "Exclusivity, ninety days" means you can't work with any competing brand for three months, so one energy drink deal can quietly block every other drink brand. And twelve months of usage rights means they can run your face in their ads all year.

[knowingly] This is exactly what a good manager earns their cut for: catching the lines that cost you more than the deal pays.

[thoughtful] Earned, and kept. They're never the same number. And the bigger you get, the more people stand between the two."""),

("sec09", "Level 7", """[excited] Level seven. One million followers. The number everyone dreams about.

At this level, the brand deals look completely different. Top-tier creators charge tens of thousands of dollars a post.

[warmly] And yes, now you can genuinely make a great living. In that same survey, most creators with over a million followers said they earn somewhere between fifty thousand and two hundred and fifty thousand dollars a year, or more.

[thoughtful] Good money. But notice what it's not. A million followers sounds like a millionaire. It's usually closer to a really well-paid job.

[short pause] And it's a job with one terrible rule.

[serious] If you stop posting, you stop getting paid. No sick days. No vacation pay. The second you log off, the money logs off too.

[tense] And there's a second risk at this size. One bad clip, one joke taken the wrong way, and brands can pause their deals with you overnight. At a million followers, your face is the business. So when something happens to your reputation, it happens to your whole income at once."""),

("sec10", "Level 8", """[building] Level eight. And this is where the smartest creators change the game.

[knowingly] Remember level four, where you were renting your audience? At level eight, you stop renting and start owning.

Instead of selling other people's products for a fee, you sell your own. Your own merch, a course, a paid community, a product with your name on it. And you collect people's emails, so no algorithm can ever take them away.

[thoughtful] And look at how differently it behaves. A sponsored post pays once. It's done the moment it goes live. A product you own can keep selling for months. The work is the same. The difference is who owns the thing being sold.

[serious] It's also riskier. You pay for the stock upfront, and if nobody buys, the boxes sit in your kitchen. [warmly] But it's the first time your income isn't a favor from a brand or an algorithm.

It's already happening. In one twenty twenty-six creator survey, product and merch sales plus affiliate income made up about a fifth of creator income. Creators are moving away from relying on one brand at a time.

[knowingly] Remember the side hustle video? If everything stops when you stop, you don't own a business, you own a job. [building] Level eight is the moment an influencer becomes a business."""),

("sec11", "Level 9", """[impressed] Level nine. Ten million followers. At this point, you're not really an influencer anymore. You're a media company with a face.

You've got producers, lawyers, a whole department just for sponsorships, and products sitting in real stores.

Forbes estimates that the fifty highest-paid creators earned over a billion dollars combined in a single year, and the top one brought in about three hundred million on his own.

[thoughtful] And look closely at that list. Many of the people at the top aren't living off ad money alone. They've built companies: snacks, games, clothing, production studios. The videos are the marketing. The businesses are the money.

[short pause] [serious] But that's fifty people. Out of tens of millions of creators."""),

("sec12", "Payoff", """[curious] So, which level is the one where an influencer actually starts making a living?

It's not a million followers. A million followers can still be one bad month from broke.

[serious] The most dangerous level is a hundred thousand. You're famous enough to spend like you're rich, but your income is a heartbeat monitor.

[building] The real level-up is level eight, the moment you own something. A product, a list, a business that keeps paying when you stop posting. Because followers are borrowed, and the platform can take them back anytime. [warmly] What you own, you keep.

So if you're thinking of becoming a creator, don't ask, "How do I get a million followers?" Ask, "What will I own when I get there?"

[cheerful] What level would you want to stop at? Tell me in the comments. [chuckles] And if this video earns a single cent, you'll know exactly where it went.

And if you want to see how that famous-but-broke lifestyle gets paid for, watch this one next."""),
]

SHORTS = [
("shortA", "Short A: 1M views", """[curious] You got a million views. How much did you make?

[matter-of-fact] On YouTube, you only keep fifty-five percent of the ad money on regular videos, and forty-five percent of your share on Shorts. The platform keeps the rest.

So a million views on a Short might pay… [deadpan] tens to a few hundred dollars. The same views on a long video could pay thousands. [surprised] Same views. A completely different check.

[knowingly] That's why creators who look famous are often broke, and why the smart ones sell their own stuff.

[mysteriously] So next time you see a video with a million views, ask the real question…"""),
("shortB", "Short B: Free hoodie", """[playful] A brand sends you a free hoodie. [short pause] [deadpan] Congrats… you might owe taxes on it.

[matter-of-fact] In the U.S., products you get in exchange for promotion generally count as income, at what they'd cost to buy. And if you post about it, the FTC says you have to disclose it, right there in the post. Not in your bio.

[wryly] Ten free hoodies a month? That's real income on paper… and not one dollar in your bank.

[knowingly] So the next time a DM says "can we send you something?", remember what really happens when…"""),
]

KEEP = {'US', 'OK', 'DM', 'DMs', 'FTC', 'TV'}
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
