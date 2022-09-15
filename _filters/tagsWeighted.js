module.exports = function(collection) {
  let tagCountMap = new Map();
  collection.getAllSorted().forEach(function(item) {
    if('tags' in item.data) {
      let tags = item.data.tags;
      if (typeof tags === 'string') {
        tags = [tags];
      }

      tags = tags.filter(function(item) {
        // disallow certain collections
        switch(item) {
          case "all":
          case "travel":
          case "blog":
            return false;
        }

        return true;
      });

      for (const tag of tags) {
        if (tagCountMap.has(tag)) {
          count = tagCountMap.get(tag);
          tagCountMap.set(tag, count+1);
        } else {
          tagCountMap.set(tag, 1);
        }
      }
    }
  });

  return tagCountMap.entries();
};
