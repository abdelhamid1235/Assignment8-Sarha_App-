import bcrypt from "bcrypt";

export const hash = async (plainText, rounds = 12, minor = "b") => {
    const salt = (await bcrypt.genSalt(rounds, minor)).toString();
    return await bcrypt.hash(plainText, salt);
};

export const compare = async (plainText, ciperText) => {
    return await bcrypt.compare(plainText, ciperText);
};