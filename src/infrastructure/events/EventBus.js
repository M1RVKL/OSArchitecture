import { EventEmitter } from 'events';

class EventBus {
    constructor() {
        this.emitter = new EventEmitter();
    }

    subscribe(eventName, handler) {
        this.emitter.on(eventName, handler);
        console.log(`[EventBus] 🎧 Підписано на подію: ${eventName}`);
    }

    publish(event) {
        console.log(`[EventBus] 📢 Опубліковано подію: ${event.name} о ${event.timestamp.toISOString()}`);
        this.emitter.emit(event.name, event);
    }
}

export const eventBus = new EventBus();