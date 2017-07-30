# Anime screenshot handler

 >  Categorizes anime screenshots and copies them to the clipboard.

How to use:

 1. Install.
 2. Configure.
 3. Run.
 4. Start watching anime and taking screenshots.

## Installing

````bash
git clone https://github.com/aliceklipper/anime-screenshots-handler.git
cd anime-screenshots-handler
yarn
````

## Configuration

The program is configured by editing the `index.js`.

 *  `uncategorized: string` —
    input directory,
    the path to directory with uncategorized screenshots from a video player.
 *  `categorized: string` —
    output directory, the path to directory with categorized screenshots,
    categorized by anime title.

You can also configure file name normalization.
Currently it removes the `/ \[\d+:\d+:\d+.\d+]\[\d+]\.png$/` regexp,
which matches the ` [%P][%ty%tm%td%tH%tM%tS]` template
from mpv's `screenshot-template` option.

The normalized file name should contain only original video's name,
maybe without the extension.
Otherwise, it may be parsed erroneously.

## Running

````bash
yarn start
````
