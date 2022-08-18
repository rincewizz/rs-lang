const HOST = 'http://localhost:8082/';

export const getWords = async (group = 0, page = 0) => {
  const rawResponse = await fetch(`${HOST}words?group=${group}&page=${page}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const content = await rawResponse.json();

  return content;
};

export const getWordById = async (id: string) => {
  const rawResponse = await fetch(`${HOST}words/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const content = await rawResponse.json();

  return content;
};
