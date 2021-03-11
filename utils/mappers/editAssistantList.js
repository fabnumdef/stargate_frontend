// update list according to checked items
export default function updateAssistantList(array, assistants) {
    const removeToDelete = [];
    const collector = [];
    return array.reduce((unique, item) => {
        if (collector.includes(item.id)) {
            const updatedList = assistants
                .filter((el) => el.id === item.id)
                .map((el) => {
                    if (removeToDelete.includes(item.id)) {
                        const { ...cleanItem } = item;
                        return cleanItem;
                    }
                    return { ...el, toDelete: true };
                });
            return updatedList.concat(unique.filter((el) => el.id !== item.id));
        }
        collector.push(item.id);
        if (item.toDelete === true) {
            removeToDelete.push(item.id);
        }
        return [...unique, item];
    }, []);
}
