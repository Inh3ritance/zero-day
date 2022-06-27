export const createUserRequest = async (
  username: string,
  csrng: string,
) => {
  try {
    const { status } = await fetch(`${'http://localhost:9000'}/createUser`, {
      method: 'POST',
      body: JSON.stringify({
        user: `${username}#${csrng.substring(0, 5)}`,
        pass: csrng,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    return { status };
  } catch (err) {
    console.warn(err);
    return { status: 500 };
  }
};
