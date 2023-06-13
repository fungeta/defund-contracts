import {ContractModel} from "../app/application/w3/w3.model";

export interface EnviromentModel {
    factoryContract: ContractModel,
    defundContract: ContractModel,
    erc20Contract?: ContractModel
}
