const fetch = require('node-fetch');
const axios = require('axios');
import {query} from "./query";


export default class VegaGovernance {

    /**
     * Build a new Vega Governance service.
     * @param endpoint {String} Root URL.
     */
    constructor(endpoint) {
        this.endpointRest = endpoint;
        this.endpointGraphQL = `${this.endpointRest}/query`;
        this.endpointGetTime = `${this.endpointRest}/time`;
        this.endpointPrepareVote = `${this.endpointRest}/governance/prepare/vote`;
        this.endpointSubmitTransaction = `${this.endpointRest}/transaction`;
        this.endpointListAssets = `${this.endpointRest}/assets`;
        this.endpointNetworkParameters = `${this.endpointRest}/network/parameters`;

    }

    async getTime() {
        return await axios.get(this.endpointGetTime);
    }

    async getNetworkParameters() {
        return await axios.get(this.endpointNetworkParameters);
    }

    async partyVotes(party) {
        return await axios.get(`${this.endpointRest}/parties/${party}/votes`);
    }

    async prepareVote(proposalID, partyID, timestamp, voteValue) {
        return await axios.post(
            this.endpointPrepareVote, {
                vote: {
                    partyID: partyID,
                    proposalID: proposalID,
                    timestamp: timestamp,
                    value: voteValue,
                }
            }
        );
    }

    async listProposals() {
        const data = fetch(this.endpointGraphQL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({query: query.listProposals})
        })
            .then(r => r.json());
        return await data;
    }

    async getProposal(id) {
        const data = fetch(this.endpointGraphQL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query.proposalByID,
                variables: {id},
            })
        })
            .then(r => r.json());
        return await data;
    }

    async getTVoteBalance(partyID){
        const accountsResponse = await this.listAccounts(partyID);
        if (Array.isArray(accountsResponse.data.accounts)) {
            for(const account of accountsResponse.data.accounts) {
                if (account.asset === localStorage.getItem('tVoteAssetId') ) {
                    return parseInt(account.balance);
                }
            }
        }
        return 0;
    }

    async submitTransaction(tx, type = "TYPE_COMMIT"){
        try {
            const requestPayload = {
                tx: {
                    tx: tx.tx,
                    sig: {
                        sig: tx.sig.sig,
                        algo: tx.sig.algo,
                        version: `${tx.sig.version}`,
                    }
                },
                type: type,
            };
            return await axios.post(
                this.endpointSubmitTransaction,
                requestPayload,
            );
        }catch (error){
            console.error(error);
        }
    }

    async myVoteFor(partyVotes, proposalID){
        let voteValue = null;
        for(const vote of partyVotes){
            if(vote.proposalID === proposalID){
                voteValue = vote.value;
            }
        }
        return voteValue;
    }

    async listProposalsByParty(id) {
        const data = fetch(this.endpointGraphQL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query.listProposalsByParty,
                variables: {id},
            })
        })
            .then(r => r.json());
        return await data;
    }

    async listAssets(){
        return await axios.get(this.endpointListAssets);
    }

    async listAccounts(pubKey){
        return await axios.get(`${this.endpointRest}/parties/${pubKey}/accounts`);
    }

    async weightedVotes(proposal){

    }
}


