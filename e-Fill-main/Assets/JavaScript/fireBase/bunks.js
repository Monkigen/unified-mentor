import { dBase } from "./app.js"
import {
    ref, get, push, update, remove,
    query, orderByChild,
    equalTo, limitToFirst, limitToLast
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { uploadImage, deleteImage } from "./images.js"
import { sortbyDateTime, sortbyInteger } from "../common/utils/basic.js"
import { createLogger } from "../common/utils/logger.js"

const logger = createLogger('bunks-service');
const BUNKS = "bunks/"

// Input validation
const validateBunkData = (data) => {
    const requiredFields = ['bunkname', 'bunkslots', 'bunkfreeslots', 'bunknumber', 'bunkemail', 'bunkaddress', 'bunkcity'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    if (Number.parseInt(data.bunkfreeslots) > Number.parseInt(data.bunkslots)) {
        throw new Error('Free slots cannot be greater than total slots');
    }
}

// Create/Update bunk details
export const addUpdateBunk = async (uid, data, create) => {
    try {
        logger.info(`${create ? 'Creating' : 'Updating'} bunk for user ${uid}`);
        validateBunkData(data);

        data.bunkimage = await uploadImage(uid, data.bunkimage, data.bunkimageid);
        const bunkId = String(data.bunkid);
        const bunkPath = (bunkId.length > 0 && bunkId != "") ? bunkId : "";
        const newBunkRef = ref(dBase, BUNKS + bunkPath);

        data = standardizeData(data);
        let result;

        if (create) {
            data.ownerId = uid;
            data.createdOn = data.modifiedOn;
            const bunkRef = push(newBunkRef, data);
            result = await getBunkData(bunkRef);
            logger.info(`Created new bunk with ID: ${bunkRef.key}`);
        } else {
            await update(newBunkRef, data);
            result = await getBunkData(newBunkRef);
            logger.info(`Updated bunk with ID: ${bunkId}`);
        }

        return result;
    } catch (error) {
        logger.error(`Failed to ${create ? 'create' : 'update'} bunk:`, error);
        throw new Error(`Failed to ${create ? 'create' : 'update'} charging station: ${error.message}`);
    }
}

// Make bunk data to Standard formats
const standardizeData = (data) => {
    const dateTime = new Date().toJSON();
    const totalSlots = Number.parseInt(data.bunkslots);
    const freeSlots = Number.parseInt(data.bunkfreeslots);
    data = {
        modifiedOn: dateTime,
        name: data.bunkname,
        slots: totalSlots,
        freeslots: freeSlots,
        number: data.bunknumber,
        email: data.bunkemail,
        imageUrl: data.bunkimage,
        address: data.bunkaddress,
        city: data.bunkcity,
        country: data.bunkcountry
    }
    return data
}

// Collect a bunk data with 'reference'
const getBunkData = async (reference) => {
    const bunkRef = await get(reference)
    let bunkData = bunkRef.val()
    bunkData.id = reference.key
    return bunkData
}

// Collect a bunk data with 'id'
export const collectBunkData = async (id) => {
    try {
        const bunkRef = ref(dBase, BUNKS + id)
        return await getBunkData(bunkRef)
    }
    catch (error) {
        throw error.message
    }
}

// Filtering by bunk-OwnerID
export const OWNERID = "ownerId"
export const getBunksByOwnerId = async (uid, count, fromLast) => {
    let limiter = fromLast ? limitToLast(count) : limitToFirst(count)
    const authUserBunksRef = query(ref(dBase, BUNKS), orderByChild(OWNERID), equalTo(uid), limiter)
    try {
        const allBunksOfAdmin = await get(authUserBunksRef)
        const bunks = allBunksOfAdmin.val()
        let keysOrder = sortbyDateTime(bunks, "modifiedOn", true)
        return { bunks, keysOrder }
    }
    catch (error) {
        return null
    }
}

// Filtering by freeslots & location
const FREESLOTS = "freeslots", FILTER_KEYS = ["searchfor", "hasslots"]
export const getBunksByLocation = async (filter) => {
    const allBunkRef = query(ref(dBase, BUNKS), orderByChild(FREESLOTS))
    try {
        const allBunks = (await get(allBunkRef)).val()
        let bunks = {}
        let searchfor = filter[FILTER_KEYS[0]]
        let hasslots = filter[FILTER_KEYS[1]]
        if (searchfor != "") {
            searchfor = encodeValue(searchfor)
            bunks = { ...bunks, ...filterByKey(allBunks, ["city", "country"], searchfor) }
        }
        else bunks = allBunks
        if (hasslots == "true") {
            bunks = filterByKey(bunks, FREESLOTS)
        }
        let keysOrder = sortbyInteger(bunks, FREESLOTS, true)
        return { bunks, keysOrder }
    }
    catch (error) {
        return null
    }
}

const encodeValue = (val) => {
    return encodeURIComponent(val.toLowerCase())
}

const filterByKey = (obj, key, value) => {
    let filteredObj = {}
    const isArray = key instanceof Array
    Object.keys(obj).forEach((k) => {
        let c_Obj = obj[k]
        if (isArray) {
            if (encodeValue(c_Obj[key[0]]) == value) {
                filteredObj[k] = c_Obj
            }
            else if (encodeValue(c_Obj[key[1]]) == value) {
                filteredObj[k] = c_Obj
            }
        }
        else if (c_Obj[key] > 1) {
            filteredObj[k] = c_Obj
        }
    })
    return filteredObj
}

// Delete Bunk data
export const deleteBunk = async (bid) => {
    const bunkRef = ref(dBase, BUNKS + bid)
    const bunkData = await getBunkData(bunkRef)
    await deleteImage(bunkData.imageUrl)
    await remove(bunkRef)
}
