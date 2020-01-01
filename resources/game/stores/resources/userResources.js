//Modolo de los recursos del usuario
export default {
    state: {
        gold:0,
        research_point:0,
        total_scientists:0,
        trade_ship:0,
        trade_ship_available:0
    },
    mutations:{
        updateUserResources(state,{gold,research_point,total_scientists,trade_ship,trade_ship_available}){
            state.gold = gold;
            state.research_point = research_point;
            state.total_scientists = total_scientists;
            state.trade_ship = trade_ship;
            state.trade_ship_available = trade_ship_available;
        },
        colonize(state,{gold,ships}){
            state.gold -= gold
            state.trade_ship_available -= ships
        },
        research(state,{research_point}){
            state.research_point -= research_point;
        },
        buyTradeShip(state,{goldCost}){
            state.gold -= goldCost;
            state.trade_ship += 1;
            state.trade_ship_available += 1;
        },
        addTradeShip(state,{ships}){
            state.trade_ship_available += ships;
        },
        useShip(state,{ships}){
            state.trade_ship_available -= ships;
        }
    }
}
