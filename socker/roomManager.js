import { Server, Socket } from 'socket.io';
import { Adapter } from 'socket.io-adapter';

DEFAULT_MAX_PLAYERS = "";
DEFAULT_MAX_TIMER = "";

export default class Room {
    constructor(options) {
        this.io = options.io;
        this.socker = options.socker;
        this.username = options.usename;
        this.roomId = options.roomId;
        this.action = options.action; //join or create
        this.store = options.io.adapter;
        this.options = {
            maxPlayersLimit: DEFAULT_MAX_PLAYERS,
            maxTimerLimit: DEFAULT_MAX_TIMER,
        }
    }

    /**
     * initializes steps on first connection
     * 
     * Check if room is available:
     *  If yes, then join room.
     *  If no, then create room.
     * 
     */
    async init(username) {
        const clients = await this.io.in(this.roomId).allSockets();
        if (!clients) console.error('Room creation failed');

        console.debug(`Connected clients are ${clients}`);

        if (this.action == 'join') {
            this.store = this.store.rooms.get(this.roomId);
            if (clients.size > 0) {
                await this.socker.join(this.roomId);
                this.store.clients.push({ id: this.socket.id, username, isReady: false });
                this.socker.username = username;
                this.socker.emit('Successfully initialised', {
                    roomId: this.roomId,
                    options: this.options,
                });
                console.log(`Client joined room ${this.roomId}`);
                return true;
            }

            console.error(`Client denied join, roomId ${this.roomId} not created`)
            this.socker.emit('Error: Create a room first!');
            return false;
        }

        if (this.action == 'create') {
            if (clients.size == 0) {
                await this.socker.join(this.roomId);
                this.store = this.store.rooms.get(this.roomId);

                this.store.clients = [{ id: this.socker.id, username, isReady: false }];

                this.socker.username = username;
                console.log(`Client created and joined room ${this.roomId}`);
                this.socker.emit('Successfully initialised', {
                    roomId: this.roomId,
                    options: this.options,
                });
                return true;
            }

            console.error(`Client denied join, roomId ${this.roomId} already exists`)
            this.socker.emit('Error: Room already exists. Join the room!');
            return false;
        }
    }

    showPlayers() {
        const { clients } = this.store;
        this.io.to(this.roomId).emit('show-players-joined', { playersJoined: clients });
    }

    isReady() {
        this.socker.on('is-ready', () => {
            for (const player of this.store.clients) {
                if (player.id == this.socker.id) {
                    player.isReady = true;
                }
            }

            this.showPlayers();

            const arePlayersReady = this.store.clients.every(player => player.isReady === true);
            if (arePlayersReady) {
                this.beginGame();
            }
        });
    }

    beginGame() {

    }

    // shift turns (person who is trying to guess), will just rotate

    /**
     * will have to add logic for:
     * - draw from pile
     * - picking category from card and labelling the category
     *   - select random from sql/mongo, and add to discard pile so won't be picked again
     * - user to submit card
     * - card items + item from card to be mixed, user selects
     * - person trying to guess can pick, points adjusted accordingly based on selection
     * - 
     * 
     */
}