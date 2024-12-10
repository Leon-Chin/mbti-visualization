export const preprocessData = (text) => {
    const rows = text.split('\n').filter((row) => row.trim() !== ''); // Split by line and filter out empty rows
    let headers = rows[0].split(','); // Extract the headers from the first row
    headers = headers.map((header) => header.trim());

    const data = rows.slice(1).map((row) => {
        const values = row.split(','); // Split the row into values
        const obj = {};
        headers.forEach((header, index) => {
            const value = values[index]?.trim(); // Trim whitespace
            obj[header] = isNaN(Number(value)) ? value : Number(value); // Convert to number if possible
        });

        return obj; // Return the constructed object for this row
    });
    // change data format to the right format
    const concreteData = data.map((i) => {
        const country = i.Country; // Extract the country
        const removeObjectProperty = (obj, key) => {
            const newObj = { ...obj }; // Create a copy of the object
            delete newObj[key]; // Remove the specified property
            return newObj;
        };

        const newData = removeObjectProperty(i, 'Country'); // Remove "Country" from the data
        const value = {}; // Rebuild the object with numeric values
        Object.keys(newData).forEach((key) => {
            value[key] = Number(newData[key]);
        });
        return { country: country, value, max: { key: '', value: 0 }, min: { key: '', value: 1 } }; // Return data in the correct format
    });

    // get the max and min personality of each country
    const mergeValuePairs = (data) => {
        return data.map((item) => {
            const mergedValue = {}; // 用于存放合并后的数据
            let max = { key: '', value: Number.NEGATIVE_INFINITY };
            let min = { key: '', value: Number.POSITIVE_INFINITY };
            Object.keys(item.value).forEach((key) => {
                const baseKey = key.split('-')[0]; // 提取前缀（例如，ENFJ）
                if (!mergedValue[baseKey]) {
                    mergedValue[baseKey] = 0; // 初始化合并键
                }
                mergedValue[baseKey] += Number(item.value[key]); // 累加值
            });
            Object.keys(mergedValue).forEach((key) => {
                if (mergedValue[key] > max.value) {
                    max = { key: key, value: mergedValue[key] };
                }
                if (mergedValue[key] < min.value) {
                    min = { key: key, value: mergedValue[key] };
                }
            });

            return {
                country: item.country,
                value: mergedValue, // 更新合并后的值
                max: {
                    key: max.key,
                    value: max.value
                },
                min: {
                    key: min.key,
                    value: min.value
                }
            };
        });
    };
    const mergedData = mergeValuePairs(concreteData);


    const addCategoryRatios = (data) => {
        const categories = {
            Extraverted: ['ENFJ', 'ENFP', 'ENTJ', 'ENTP', 'ESFJ', 'ESFP', 'ESTJ', 'ESTP'],
            Introverted: ['INFJ', 'INFP', 'INTJ', 'INTP', 'ISFJ', 'ISFP', 'ISTJ', 'ISTP'],
            Intuitive: ['ENFJ', 'ENFP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'INTJ', 'INTP'],
            Observant: ['ESFJ', 'ESFP', 'ESTJ', 'ESTP', 'ISFJ', 'ISFP', 'ISTJ', 'ISTP'],
            Thinking: ['ENTJ', 'ENTP', 'ESTJ', 'ESTP', 'INTJ', 'INTP', 'ISTJ', 'ISTP'],
            Feeling: ['ENFJ', 'ENFP', 'ESFJ', 'ESFP', 'INFJ', 'INFP', 'ISFJ', 'ISFP'],
            Judging: ['ENFJ', 'ENTJ', 'ESFJ', 'ESTJ', 'INFJ', 'INTJ', 'ISFJ', 'ISTJ'],
            Prospecting: ['ENFP', 'ENTP', 'ESFP', 'ESTP', 'INFP', 'INTP', 'ISFP', 'ISTP'],
        };

        return data.map((item) => {
            const categoryRatios = {};
            Object.keys(categories).forEach((category) => {
                const positiveGroup = categories[category];
                const positiveSum = positiveGroup.reduce((sum, type) => sum + (item.value[type] || 0), 0);
                categoryRatios[category] = positiveSum;
            });

            return {
                ...item,
                categoryRatios, // Add all category comparisons
            };
        });
    };
    return addCategoryRatios(mergedData);
};
