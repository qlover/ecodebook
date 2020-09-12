import { Message } from "../../Contracts/RetJson";
import {
  API_DICT_GET,
  API_DICTS_ADD,
  API_DICTS_UPDATE,
  API_DICTS_GET,
  API_DICTS_DELTE,
} from "../../Config/api";
import { Paginate, Sort } from "../../Contracts/Types/Service";
import ApiService from "./ApiService";
import DictSaveRequest from "../../Validation/DictSaveRequest";

/** Interface and Types */
export interface DictEntity {
  id: number;
  title: string;
  website: string;
  username: string;
  password: string;
  phone: string;
  email: string;
}

export interface DictList {
  current_page: number;
  data: Array<DictEntity>;
  last_page: number;
  total: number;
}

export interface RetGetDict extends Message {
  dict: DictEntity;
}

export interface RetGetList extends Message {
  dicts: DictList;
}

export interface RetAddDict extends Message {
  dict: DictEntity;
}

/** Class */
export default class DictService extends ApiService {
  constructor() {
    super();
  }

  getList(paginate: Paginate, sort: Sort): Promise<RetGetList> {
    return this.api().request(API_DICTS_GET, { ...paginate, ...sort });
  }

  getDict(id: number): Promise<RetGetDict> {
    return this.api().request(API_DICT_GET, { id });
  }

  deleteDict(id: number[]): Promise<Message> {
    return this.api().request(API_DICTS_DELTE, { id: id.join(",") });
  }

  addDict(dict: DictEntity): Promise<RetAddDict> {
    // 保证 dict 没有 id
    if (dict.id) {
      delete dict.id;
    }
    return this.api()
      .before(DictSaveRequest.validation)
      .request(API_DICTS_ADD, dict);
  }

  updateDict(dict: DictEntity): Promise<Message> {
    return this.api()
      .before(DictSaveRequest.validation)
      .request(API_DICTS_UPDATE, dict);
  }
}

/** default */

export const _DictEntity = {
  title: "",
  website: "",
  username: "",
  password: "",
  phone: "",
  email: "",
};
