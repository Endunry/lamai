import { Agent } from "../agents/Agent";
import RandomAgent from "../agents/RandomAgent";
import ReflexAgent from "../agents/ReflexAgent";
import ReplanningAgent from "../agents/ReplanningAgent";
import { AgentType } from "../types/maps";
import { globals } from './singletons';

export class AgentDecoder {
    static agentTypeToClass(str: AgentType) : typeof Agent {
        switch (str) {
            case 'reflex':
                return ReflexAgent;
            case 'random':
                return RandomAgent;
            case 'replanning':
                return ReplanningAgent;
            default:
                return null;
        }
    }

    static agentClassToAgentType(agentClass: typeof Agent): AgentType {
        switch (agentClass?.name) {
            case 'RandomAgent':
                return 'random';
            case 'ReflexAgent':
                return 'reflex';
            case 'ReplanningAgent':
                return 'replanning';
            default:
                return null;
        }
    }

}