export const mapVisitorData = (data) => {
  const { kind, reference, ...visitor } = data;

  if (visitor.isInternal && typeof visitor.isInternal === 'string') {
    if (visitor.isInternal === 'MINARM') visitor.isInternal = true;
    if (visitor.isInternal === 'HORS MINARM') visitor.isInternal = false;
  }

  if (visitor.vip && typeof visitor.vip === 'string') {
    if (visitor.vip === 'TRUE') visitor.vip = true;
    if (visitor.vip === 'FALSE') visitor.vip = false;
  }

  return { ...visitor, identityDocuments: { kind, reference } };
};

export default {};
