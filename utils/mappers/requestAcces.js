export const mapVisitorData = (data) => {
  const { kind, reference, ...visitor } = data;

  if (visitor.isInternal && typeof visitor.isInternal === 'string') {
    if (visitor.isInternal.toLowerCase() === 'MINARM') visitor.isInternal = true;
    if (visitor.isInternal.toLowerCase() === 'HORS MINARM') visitor.isInternal = false;
  }

  if (visitor.vip && typeof visitor.vip === 'string') {
    if (visitor.vip.toLowerCase() === 'TRUE') visitor.vip = true;
    if (visitor.vip.toLowerCase() === 'FALSE') visitor.vip = false;
  }

  return { ...visitor, identityDocuments: { kind, reference } };
};

export default {};
