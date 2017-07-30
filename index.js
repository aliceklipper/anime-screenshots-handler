import f from 'flow-runtime';
import { watch, rename, access } from 'fs';
import { spawn } from 'child_process';
import { URL } from 'url';
import { join } from 'path';
import anitomy from 'anitomyjs';
import mkdirp from 'mkdirp';
import debug from 'debug';
import uuid from 'uuid';

const uncategorized = '/home/aliceklipper/Pictures/Screenshots/Mpv/';
const categorized = '/home/aliceklipper/Pictures/Screenshots/ByTitle/';

const wrap = fn => (...args) => new Promise((resolve, reject) => {
    fn(...args, (error, result) => {
        if (error) {
            reject(error);
        } else {
            resolve(result);
        }
    });
});

const parse = name => new Promise(resolve => {
    anitomy.parse(name, resolve);
});

const mkdir = wrap(mkdirp);
const move = wrap(rename);
const exists = wrap(access);

const copy = (name, log) => new Promise(async (resolve, reject) => {
    const xclip = spawn('xclip', ['-t', 'text/uri-list', '-selection', 'clipboard', '-i']);
    log('xclip spawned');

    await exists(name);
    log('file exists');

    xclip.stdin.end(`file://${name}\n`, () => log('xclip\'s stdin closed'));
    log('file name written to xclip');

    xclip.on('close', code => {
        log(`xclip finished with code ${code}`);

        if (code === 0) {
            resolve();
        } else {
            reject();
        }
    });
});

const handled = new Set();

const handle = async name => {
    const id = uuid();
    const log = debug(`anime-screenshots-handler:${id}`);

    log('handling screenshot');

    if (!handled.has(name)) {
        handled.add(name);
        log('screenshot added to handled');

        const tokens = await parse(name.replace(/ \[\d+:\d+:\d+.\d+]\[\d+]\.png$/, ''));
        log('file name parsed');

        const title = tokens.AnimeTitle;
        log(`title = ${title}`);
        const category = join(categorized, title);
        const from = join(uncategorized, name);
        const to = join(category, name);

        /* Handle new file: */
        try {
            await mkdir(category);
            log(`directory created: '${category}'`);
            await move(from, to);
            log(`file moved to: ${to}`);
            await copy(to, log);
            log('screenshot copied to clipboard');
        } catch (error) {
            log('exception handled');
        }

        log('screenshot handled');
    } else {
        log('screenshot already handled/handling');
    }
};

watch(uncategorized, f.pattern(
    (event: 'change', name: string) => handle(name),
    _ => _,
));
