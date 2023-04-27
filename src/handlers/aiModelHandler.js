const { HfInference } = require('@huggingface/inference')
const InstanceUtils = require('../util/instanceUtils.js');

const USER_NOT_REGISTERED = '<|USER_NOT_REGISTERED|>';

class discordChannelAIInstance {
    constructor(guildId) {
        this.guildId = guildId;

        this.hfClientsObj = {};
        
        this.modelName = 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5';
        this.modelParameter = {
            typical_p:0.2,
            truncate:1000,
            watermark:false,
            max_new_tokens:500,
            repetition_penalty: 1.1,
            max_time: 4,
        }
        this.context = -5;
        this._history = '';
    }

    get history() { return this._history; }
    set history(history) {
        this._history = history.split('<|endoftext|>').slice(this.context).join('<|endoftext|>'); 
    }

    _generateHfClient(userId) {
        const userCredential = InstanceUtils.getUserCredentials(this.guildId, userId);
        if(!userCredential) return USER_NOT_REGISTERED;
        return new HfInference(userCredential.hfTokenKey);
    }

    removeUserIfExists(userId) {
        const { [userId]: userToDelete, ...newHfClientsObj } = this.hfClientsObj;
        this.hfClientsObj = newHfClientsObj;
    }

    async getResponse(userId, textInput) {
        if(!this.hfClientsObj[userId]) {
            const clientObj = this._generateHfClient(userId);
            if(clientObj === USER_NOT_REGISTERED) return USER_NOT_REGISTERED;
            this.hfClientsObj[userId] = clientObj;
        }

        const hfClient = this.hfClientsObj[userId];

        const reqText = this.history === ''
        ? `<|prompter|>${textInput}<|endoftext|><|assistant|>`
        : `${this.history}${textInput}<|endoftext|><|assistant|>`;

        const { generated_text: generatedText } = await hfClient.textGeneration({
            model: this.modelName,
            inputs: reqText,
            parameters: this.modelParameter,
        });

        const formattedResponse = generatedText.split('<|assistant|>').slice(-1)[0];

        this.history = this.history === ''
        ? `${reqText}${formattedResponse}<|endoftext|><|prompter|>`
        : `${this.history}${formattedResponse}<|endoftext|><|prompter|>`
        
        // console.log(JSON.stringify({h:this.history}, null, 2));
        return formattedResponse;
    }
}

// TODO:
const guildsLRUCache = {};

module.exports = {
    async aiResponseHandler(message) {
        const guildId = message.guildId;
        if(!guildsLRUCache[guildId]) {
            guildsLRUCache[guildId] = new discordChannelAIInstance(guildId);
        }

        const userId = message.author.id;
        const textInput = message.cleanContent.toLowerCase();

        return guildsLRUCache[guildId].getResponse(userId, textInput);
    },

    aiRemoveHfUserIfExists(guildId, userId) {        
        const guildHfAIInstance = guildsLRUCache[guildId];
        if(guildHfAIInstance) guildHfAIInstance.removeUserIfExists(userId);
        return '<|PASSED|>';
    },

    aiRemoveGuildIfExists(guildId) {
        delete guildsLRUCache[guildId];
        return '<|PASSED|>';
    }
};