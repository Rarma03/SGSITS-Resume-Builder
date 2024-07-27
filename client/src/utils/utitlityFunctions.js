export function checkValidEmail(email) {
    // Basic validation to check if email contains '@' and a domain part
    if (!email.includes('@') || email.split('@').length !== 2) {
        return false;
    }

    const domain = email.split('@')[1].toLowerCase();
    const allowedDomains = ['gmail.com', 'sgsitsindore.in'];

    return allowedDomains.includes(domain);
}

export function checkIfEmpty(text) {
    // if(text===' ' || text===''){
    // return true;
    // }
    //     return false;

    // more nice version of above
    return text.trim() === '';
}