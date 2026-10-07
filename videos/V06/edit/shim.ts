(globalThis as any).FontFace = class { load() { return Promise.resolve(this); } }; (globalThis as any).document = {fonts: {add() {}}};
