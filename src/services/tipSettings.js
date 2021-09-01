import axios from '../utils/axios';
import { OCCUPIED } from '../constants/nxt-table-statuses';


export const getTipConfigs = async (companyId,branchId) => {
  const url = `/admin/companies/${companyId}/tip-configs?branchId=${branchId}`;
  var response = null;
  try {
    response = await axios.get(url);
  } catch (error) {
    response = error.response || error;
  }

  return response;
};

