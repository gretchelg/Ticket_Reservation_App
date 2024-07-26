

let newBookingsAllowed = true;

export const GetNewBookingsAllowed = () => {
    return newBookingsAllowed;
};

export const SetNewBookingsAllowed = (enabled: boolean) => {
    newBookingsAllowed = enabled;
};
