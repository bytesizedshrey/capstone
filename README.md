# hateable

![hateable](screenshot.png)

> darling, i'm a nightmare dressed like a daydream, mostly because my hosting budget is literally zero.

welcome to hateable. you wanted an isolated sandbox playground to yap your dream frontend apps into existence? congratulations, you found the scrappiest one on the internet. it’s giving neo-brutalism, it’s giving duct-tape engineering, and honestly? it’s giving “loveable on a low budget.” 

we do the heavy lifting. you just sit there, spill the tea to our ai, and try to ignore the fact that the server is probably crying. period.

## the vibe
magic, madness, heaven, sin. 
we got a long list of ex-frameworks, they'll tell you we're insane. but we've got a blank space, baby, and we'll write your react code. it’s unapologetic, it’s loud, and it serves bad bitch energy from a refurbished macbook. it slays, but lowkey it's just trying its best.

## features
- **zero-config sandboxes:** it literally just works. please don't look at the backend logs. we spin up a fully isolated environment faster than you can say *please please please* don't crash. you want a preview URL? handled. 
- **the aesthetic:** hard borders, sharp shadows, and loud, vibrant colors. we went with neo-brutalism because paying a UI designer wasn't in the budget. no soft rounded corners here, sweetie. it's serving unbothered, thrifty brutality. 
- **ai-powered flex:** an ai assistant that actually gets it. no emojis, no cringe corporate speak, just straight up shipping features while silently judging your messy tech stack. that's that me espresso (made at home to save money).
- **tactile supremacy:** buttons that scale when you click them, dials that feel real. touch it, play with it, break it. we love the drama, even if we can't afford the server costs to fix it.

## running it (if you're brave)
it's gonna be forever, or it's gonna go down in flames.

you need docker desktop and kubernetes. give it all your ram. don't be stingy, i did not optimize this architecture. 

```bash
# literally just type this and pray
skaffold dev
```

if your machine hits you with `insufficient memory`, that sounds like a you problem, babe. close your 400 chrome tabs and try again. 

once the pods are actually running (and they will, because i duct-taped the s3 regions together, you're welcome), head to localhost and start building. 

## the architecture (aka the brains behind the beauty)
it's a full microservices stack because keeping it simple is boring, and i like to overcomplicate my life on a low budget.
- **router:** cherry-picks who gets in and who gets a 504. very exclusive.
- **auth:** google oauth so they can track your every move. love that for us.
- **ai-orchestration:** translates your late-night yapping into actual, functional code. 
- **sandbox-api:** spins up custom pods for your workspace. we can make the bad pods good for a weekend.
- **sync-agent:** syncs your code with aws s3. currently pointing to `ap-south-1` because having the wrong region crashing the cluster was *such* a bad coincidence. 

## license
MIT. steal it, copy it, fork it. we're all broke anyway, just take it.
