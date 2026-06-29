# hateable

![hateable](screenshot.png)

> darling, i'm a nightmare dressed like a daydream, but my code compiles on the first try. i slayyyyy.

welcome to hateable. you wanted an isolated sandbox playground to yap your dream frontend apps into existence? congratulations, you found it. it’s giving neo-brutalism, it’s giving zero-config perfection, and honestly? it’s giving “when did you get hot?” 

we do the heavy lifting. you just sit there, look pretty, spill the tea to our ai, and try not to disassociate. period.

## the vibe
magic, madness, heaven, sin. 
we got a long list of ex-frameworks, they'll tell you we're insane. but we've got a blank space, baby, and we'll write your react code. it’s unapologetic, it’s loud, and it serves bad bitch energy on a very low budget.

## features
- **zero-config sandboxes:** literally just works. we spin up a fully isolated environment faster than you can say *please please please* don't crash. you want a preview URL? handled. terminal access? handled. i’m a diva, i don't do manual setup.
- **the aesthetic:** hard borders, sharp shadows, and loud, vibrant colors. no soft rounded corners here, sweetie. it's serving unbothered, high-fashion brutality. loveable on a low budget, but we still slay.
- **ai-powered flex:** an ai assistant that actually gets it. no emojis, no cringe corporate speak, just straight up shipping features while silently judging your messy tech stack. that's that me espresso.
- **tactile supremacy:** buttons that scale when you click them, dials that feel real. touch it, play with it, break it. we love the drama.

## running it (if you think you can handle it)
it's gonna be forever, or it's gonna go down in flames.

you need docker desktop and kubernetes. give it all your ram. don't be stingy, this architecture is high maintenance.

```bash
# literally just type this and pray
skaffold dev
```

if your machine hits you with `insufficient memory`, that sounds like a you problem, babe. close your 400 chrome tabs, buy a macbook pro, and try again. 

once the pods are actually running (and they will, because i fixed the s3 regions, you're welcome), head to localhost and start building. 

## the architecture (aka the brains behind the beauty)
it's a full microservices stack because keeping it simple is for the weak. i slay complex distributed systems, even on a low budget.
- **router:** cherry-picks who gets in and who gets a 504. very exclusive.
- **auth:** google oauth so they can track your every move. love that for us.
- **ai-orchestration:** translates your late-night yapping into actual, functional code. 
- **sandbox-api:** spins up custom pods for your workspace. we can make the bad pods good for a weekend.
- **sync-agent:** syncs your code with aws s3. currently pointing to `ap-south-1` because having the wrong region crashing the cluster was *such* a bad coincidence. 

## license
MIT. steal it, copy it, fork it. i promise i won't hold a grudge (i absolutely will). 
